import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import Symptom from '../modules/diseases/models/symptoms';
import Disease from '../modules/diseases/models/disease';
import DiseaseSymptom from '../modules/diseases/models/disease.symptom';
import sequelize from '../database/sequelize'; // Adjust this import based on your project structure
import TrackingData from '../modules/diseases/models/tracking.data';
import DiseaseTrackingData from '../modules/diseases/models/disease.trackingdata';

async function parseAndStoreCSV(filePath: string) {
  const results: { Disease: string; [key: string]: string | null }[] = [];
  Disease.belongsToMany(Symptom, { through: DiseaseSymptom, foreignKey: 'diseaseId' });
  Symptom.belongsToMany(Disease, { through: DiseaseSymptom, foreignKey: 'symptomId' });

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Parsing complete, now store in the DB
      try {
        for (const row of results) {
          // Find or create Disease
          const [disease, created] = await Disease.findOrCreate({
            where: { name: row.Disease.trim() },
          });

          // Iterate over symptom columns and associate them with the disease
          for (let i = 1; i <= 17; i++) {
            const symptomKey = `Symptom_${i}`;
            const symptomDescription = row[symptomKey]?.trim();

            if (symptomDescription) {
              // Find or create Symptom
              const [symptom, createdSymptom] = await Symptom.findOrCreate({
                where: { description: symptomDescription },
              });

              // Associate Disease and Symptom
              // @ts-ignore
              await disease.addSymptom(symptom);
            }
          }
        }

        console.log('CSV data successfully stored in the database.');
      } catch (error) {
        console.error('Error storing data in the database:', error);
      }
    });
}


async function parseAndUpdateDisease(filePath: string) {
  const results: { Disease: string; [key: string]: string | null }[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Parsing complete, now store in the DB
      try {
        for (const row of results) {
          // Find or create Disease
          const [disease, created] = await Disease.findOrCreate({
            where: { name: row.Disease.trim() },
            defaults: {
              name:  row.Disease.trim(),
              description:  row.Description?.trim() 
            }
          });

          if(!created) {
            await disease.update({ description: row.Description?.trim() })
          }
        }

        console.log('CSV data successfully stored in the database.');
      } catch (error) {
        console.error('Error storing data in the database: parseAndUpdateDisease: ', error);
      }
    });
}
async function parseAndUpdateSymptom(filePath: string) {
  const results: { Symptom: string; [key: string]: string | null }[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Parsing complete, now store in the DB
      try {
        for (const row of results) {
          // Find or create Disease
          const [s, created] = await Symptom.findOrCreate({
            where: { description: row.Symptom.trim() },
            defaults: {
              description:  row.Disease?.trim(),
              weight:  Number(row.weight) || 0
            }
          });
          if(!created) {
            await s.update({ weight:  Number(row.weight) || 0});
          }
        }

        console.log('CSV data successfully stored in the database.');
      } catch (error) {
        console.error('Error storing data in the database: parseAndUpdateSymptom: ', error);
      }
    });
}

async function parseAndStorDataToTrack(filePath: string) {
  const results: { Disease: string; [key: string]: string | null }[] = [];
  Disease.belongsToMany(TrackingData, { through: DiseaseTrackingData, foreignKey: 'diseaseId' });
  TrackingData.belongsToMany(Disease, { through: DiseaseTrackingData, foreignKey: 'trackingDataId' });

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Parsing complete, now store in the DB
      try {
        for (const row of results) {
          // Find or create Disease
          const [disease, created] = await Disease.findOrCreate({
            where: { name: row.Disease.trim() },
          });
          const regex = /,(?![^(]*\))/;
          const data_to_track = row.Data_to_Track?.toLowerCase().split(regex);
          if(!data_to_track) return;
          // Iterate over symptom columns and associate them with the disease
          for (let i = 0; i <= data_to_track.length; i++) {

            if (data_to_track[i]) {
              // Find or create Symptom
              const [trackingItem, isCreated] = await TrackingData.findOrCreate({
                where: { trackingItem: data_to_track[i] },
              });

              // Associate Disease and Symptom
              // @ts-ignore
              await disease.addTrackingData(trackingItem);
            }
          }
        }

        console.log('CSV data successfully stored in the database.');
      } catch (error) {
        console.error('🔥Error storing data in the database:', error);
      }
    });
}



async function executeMethods() {
  await sequelize.sync({ force: true });

  const filePath = path.join(__dirname, '/dataset.csv'); // Adjust the path to your CSV file
  await parseAndStoreCSV(filePath);

  const filePath2 = path.join(__dirname, '/disease_Description.csv'); // Adjust the path to your CSV file
  await parseAndUpdateDisease(filePath2);

  const filePath3 = path.join(__dirname, '/Symptom-severity.csv'); // Adjust the path to your CSV file
  await parseAndUpdateSymptom(filePath3);

  const filePath4 =  path.join(__dirname, '/data_to_track.csv');
  await parseAndStorDataToTrack(filePath4)
}

executeMethods();
