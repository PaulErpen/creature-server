require.config({
    paths: {
        'html2canvas': 'js/html2canvas.min'
    }
  });

require(['html2canvas'], function(html2canvas) {
    document.addEventListener('click', function(e) {
        if(e.target.classList.contains('screenshot-button')) {
            let slug = e.target.dataset.slug;
            //let screenshot_target = document.getElementById("screenshot-target-"+slug);
            html2canvas(document.getElementsByTagName("body")[0], {scale: 2}).then(handlePrintedCanvas.bind(null, slug));
        }
    });
});

function handlePrintedCanvas(slug, canvas) {
    var url = canvas.toDataURL("image/png");
    var link = document.createElement('a');
    link.href = url;
    link.download =  slug + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}