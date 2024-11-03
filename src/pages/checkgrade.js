import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker';
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;
export async function gradeCheck(transcriptFile, courseCode) { 
    // Read the PDF file as ArrayBuffer
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(transcriptFile);

    // Return a promise to handle the async file reading
    return new Promise((resolve, reject) => {
        fileReader.onload = async () => {
            const pdfData = new Uint8Array(fileReader.result);

            try {
                // Load the PDF document
                const pdf = await getDocument(pdfData).promise;

                // Extract text from all pages
                let textContent = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();

                    // Collect all text items from the page
                    text.items.forEach(item => {
                        textContent += item.str + ' ';
                    });
                }

                // Use regular expression to find course and grade
                const regex = /([A-Z]{4}\s\d{3})\s+\w+(?:\s\w+)*\s+\d+\.\d+\s+([A-F][+-]?)/g;
                let match;
                
                // Loop through matches to find the specified course
                while ((match = regex.exec(textContent)) !== null) {
                    const course = match[1];
                    const courseGrade = match[2];

                    // Check if the course matches the specified course code
                    if (course === courseCode) {
                        resolve(courseGrade); // Resolve with the found grade
                        return;
                    }
                }

                // If course not found, resolve with null
                resolve(null);
            } catch (error) {
                reject('Error reading PDF:', error);
            }
        };

        // Handle file reading error
        fileReader.onerror = (error) => reject('File reading error:', error);
    });
}