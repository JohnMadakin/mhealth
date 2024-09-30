import fs from 'fs';
import csv from 'csv-parser';
import Rules from '../modules/inferenceEngine/models/rules';
import sequelize from '../database/sequelize';



interface Rule {
  if: {
    disease: string;
    symptoms: string[];
  };
  then: {
    track: string[];
  };
}

function generateIfThenRules(filePath: string): Promise<Rule[]> {
  return new Promise((resolve, reject) => {
    const rules: Rule[] = [];
    fs.createReadStream(filePath)
        //@ts-ignore
      .pipe(csv())
          //@ts-ignore
      .on('data', (row) => {
        // Extract disease and symptoms from the row
        const disease = row['Disease'];
        const symptoms: string[] = [];

        for (let i = 1; i <= 17; i++) {
          const symptom = row[`Symptom_${i}`];
          if (symptom) symptoms.push(String(symptom).trim());
        }

        // Extract Data_to_Track and split into a list
        const dataToTrack = row['Data_to_Track'];
        const track = dataToTrack ? dataToTrack.split(', ') : [];

        // Create the if-then rule
        const rule: Rule = {
          if: {
            disease,
            symptoms,
          },
          then: {
            track,
          },
        };

        rules.push(rule);
      })
      .on('end', () => {
        resolve(rules);
      })
      .on('error', (_: Error) => {
        reject(_);
      });
  });
}

const filePath = 'merged_output.csv';

generateIfThenRules(filePath).then(async (rules) => {
  await sequelize.sync({ force: false });

  await Rules.create({ rule: rules });
}).catch((err) => {
  console.error('Error reading CSV file:', err);
});
