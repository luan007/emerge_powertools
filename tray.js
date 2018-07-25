window.$ = window.jQuery = require('./pptx/lib/jquery.min.js') //fix jquery shit

function generatePPT(debs) {
    var pptx = new PptxGenJS();

    var title = pptx.addNewSlide();
    title.addText("/" + debs.name, {
        x: "4%", y: "48%", fontSize: 20, fontFace: 'Nexa Bold', color: '333333'
    });
    title.addText('Generated from /c/' + debs.shortLink + " # Emerge Confidential", {
        x: "4%", y: "53%", fontSize: 10, fontFace: 'PingFang SC Bold', color: 'aaaaaa'
    });

    var desc = pptx.addNewSlide();
    desc.addText("/" + debs.name, {
        x: "4%", y: "15%", fontSize: 15, fontFace: 'Nexa Bold', color: '333333'
    });

    desc.addText(debs.desc || "[ No Description Available. ]", {
        x: "4%", y: "43%", w: "60%", lineSpacing: 23, fontSize: 15, fontFace: 'PingFang SC Lighter', color: '999999'
    });

    for (var i = 0; i < debs.attachments.length; i++) {
        var a = debs.attachments[i];
        var att = pptx.addNewSlide();

        att.addText("/" + debs.name, {
            x: "4%", y: "15%", fontSize: 15, fontFace: 'Nexa Bold', color: 'aaaaaa'
        });
        att.addText("" + a.name, {
            x: "4%", y: "20%", fontSize: 10, fontFace: 'Nexa Bold', color: '333333'
        });

        if (a.url.endsWith(".jpg")) {
            att.addImage({
                path: a.url,
                sizing: { type: 'contain', w: 2, h: 2 },
                x: "50%", y: "50%", w: 6, h: 4
            })
        }

        att.addText('Generated from /c/' + debs.shortLink + " # Emerge Confidential", {
            x: "0%", y: "94%", fontSize: 8, fontFace: 'PingFang SC', color: 'aaaaaa'
        });
        att.addText('EMERGE 2018', {
            x: "90%", y: "94%", fontSize: 8, fontFace: 'Nexa Bold', color: '888888'
        });
    }
    pptx.save('Sample Presentation');
}


setTimeout(()=> {
    var pptx = new PptxGenJS();
    var slide = pptx.addNewSlide();
    slide.addText('Table Paging Logic Check', { x:0.0, y:'90%', w:'100%', align:'c', fontSize:18, color:'0088CC', fill:'F2F9FC' });
    var numMargin = 1.25;
    slide.addShape(pptx.shapes.RECTANGLE, { x:0.0, y:0.0, w:numMargin, h:numMargin, fill:'FFFCCC' });
    slide.addTable( ['short','table','whatever'], {x:numMargin, y:numMargin, margin:numMargin, colW:2.5, fill:'F1F1F1'} );
    pptx.save('PptxGenJs-TablePagingLogicCheck')
}, 5000);