const addPicker = (function() {
  const pickerContainer = document.getElementById('pickerContainer');
  const inputFile = document.createElement('input');
  inputFile.type = 'file';
  inputFile.id = 'pdf-picker';
  inputFile.accept = '.pdf';
  pickerContainer.appendChild(inputFile);
})();

document.getElementById('pdf-picker').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const pdfData = new Uint8Array(arrayBuffer);
        pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdfDoc_) {
          console.log('PDF loaded successfully from picker');
          pdfDoc = pdfDoc_;
          
          document.querySelector('#pdf-container').innerHTML = '';
          
          let xOffset = 0;
          const pageWidth = 4;
          const spacing = pageWidth * 2.1;
          const totalWidth = pdfDoc.numPages * pageWidth + (pdfDoc.numPages - 1) * (spacing - pageWidth);

          const bgPlane = document.getElementById('bg-plane');
          bgPlane.setAttribute('width', totalWidth);
          bgPlane.setAttribute('height', totalWidth);
          bgPlane.setAttribute('position', `${totalWidth / 2 - pageWidth / 2} 0 -50`);

          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            renderPage(pageNum, xOffset);
            xOffset += spacing;
          }
        }).catch(function(error) {
          console.error('Error loading PDF from picker:', error);
        });
      };
      reader.readAsArrayBuffer(file);
    }
  });