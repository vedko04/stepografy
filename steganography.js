document.addEventListener('DOMContentLoaded', function() {
    const imageCanvas = document.getElementById('imageCanvas');
    const ctx = imageCanvas.getContext('2d');
    const imageLoader = document.getElementById('imageLoader');
    const outputImage = document.getElementById('outputImage');
    const downloadLink = document.getElementById('downloadLink');

    imageLoader.addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                outputImage.src = event.target.result; // Display original image
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    window.encode = function() {
        const message = document.getElementById('message').value + String.fromCharCode(0);
        const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        const data = imageData.data;
        let messageIndex = 0;
        const messageLength = message.length * 8;

        for (let i = 0; i < data.length; i += 4) {
            if (messageIndex < messageLength) {
                const charCode = message.charCodeAt(messageIndex >> 3);
                const bit = (charCode >>> (7 - (messageIndex % 8))) & 1;
                data[i] = (data[i] & ~1) | bit;
                messageIndex++;
            } else {
                break;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        const encodedDataUrl = imageCanvas.toDataURL('image/png');
        outputImage.src = encodedDataUrl; // Display encoded image
        downloadLink.href = encodedDataUrl; // Set the download link
        downloadLink.style.display = 'inline'; // Show the download link
    };

    window.decode = function() {
        const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        const data = imageData.data;
        let message = '';
        let currentByte = 0;
        let bitCount = 0;

        for (let i = 0; i < data.length; i += 4) {
            currentByte = (currentByte << 1) | (data[i] & 1);
            bitCount++;
            if (bitCount === 8) {
                if (currentByte === 0) {
                    break;
                }
                message += String.fromCharCode(currentByte);
                currentByte = 0;
                bitCount = 0;
            }
        }

        document.getElementById('decodedMessage').innerText = message;
    };
});
