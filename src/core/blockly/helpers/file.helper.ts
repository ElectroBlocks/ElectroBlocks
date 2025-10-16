
export function saveDownloadFile(blob: Blob, filename: string) {
    // Create a link element
    const link = document.createElement('a');

    // Set the link's attributes including the download attribute which specifies the filename
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // Simulate a click on the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
 }