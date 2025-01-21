import csv from 'csv-parser';
import validator from 'validator';
import { Readable } from 'stream';
import 'dotenv/config'



const readCsv = function(buffer) {
        const results  = [];

        return new Promise((resolve, reject) => {
                const readableStream = new Readable();
                readableStream.push(buffer); 
                readableStream.push(null); 

                const stream = readableStream
                  .pipe(csv({skipLines:1,headers:['id','email']}))
                  .on('data', row => {
                        if(Object.entries(row).length !== 0) {
                                console.log(row);
                                if(!validator.isNumeric(row.id.trim()) || !validator.isEmail(row.email.trim())) {
                                        stream.destroy(new Error('not valid format'));
                                }  else {
                                        return results.push(row);
                                }
                        }
                  })
                  .on('end',() => resolve(results))
                  .on('error', (error) => reject(error))
        })
}


const hasDuplicates = (data) => {
        
        let keys = Object.keys(data[0]);
        const values = [];
        for(const key of keys) {
                data.map((obj) => values.push(obj[key]));
        }
        
        return new Set(values).size !== values.length;
}

const handleDuplicates = (data) => {
        const parameters = Object.keys(data[0]);
        for(const parameter of parameters) {
                data =  data.filter((obj,index) => 
                        data.findIndex((item) => item[parameter] === obj[parameter]) === index
                )
        }

        return data;
}

const csvToObject = async (file,allowDuplicates) => {
        try {
                let data = await readCsv(file);
                if(hasDuplicates(data)) {
                        if(!allowDuplicates) {
                                throw new Error(" Your file has duplicate values");
                        }
                       data =  handleDuplicates(data);
                }
                
                data = data.filter((obj,index) => data.findIndex((item) => item.email === obj.email) === index);
                return data.map(entry => (
                        entry = {user_id: entry.id.trim(),email: entry.email.trim()}
                ))
        } catch(error) {
                throw error;
        }
}

// const data = await csvToObject(path.resolve('../assets/file.csv'),true);
// console.log(data);

// const csvData = fs.readFile("../assets/file.csv", 'utf8');

// // Create a JSON object with the CSV data
// const jsonData = {
//     csv: Buffer.from(csvData).toString('base64')
// };

// console.log(jsonData);

export default csvToObject;

// implement csv editor 
// 1.generate password based on id
// 2.add password column to the csv file








