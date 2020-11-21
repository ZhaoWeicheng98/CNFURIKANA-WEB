let pinyin = require("pinyin");
let cnchar = require("cnchar");
let funikanaData = require("./table.json");

// function getChinese(strValue) {
//   if (strValue != null && strValue != "") {
//     var reg = /[\u4e00-\u9fa5]/g;
//     let ret = strValue.match(reg);
//     if (ret != null && ret != "") {
//       return ret.join("");
//     }
//   } else return "";
// }

// function checkCh(ch) {
//   var uni = ch.charCodeAt(0);

//   return uni > 40869 || uni < 19968;
// }
export function ToParsedContent(text) {
  const arrowTones = [
    "&nbsp;&nbsp;&nbsp;",
    "&nbsp;→&nbsp;",
    "&nbsp;↗&nbsp;",
    "&nbsp;↘↗&nbsp;",
    "&nbsp;↘&nbsp;",
    "&nbsp;·&nbsp;",
  ];
  // let hanziContent = getChinese(text);
  let pinyinContent = pinyin(text, {
    segment: true,
  });
  let retContent = [];
  console.log(pinyinContent);
  for (let i = 0, j = 0; i < pinyinContent.length; i++) {
    let tonePinyin = pinyinContent[i][0];
    if (text[j] != tonePinyin[0]) {
      let spellInfo = cnchar.spellInfo(tonePinyin);
      let untonePinyin = spellInfo.spell;
      let tone = spellInfo.tone;
      retContent.push({
        hanzi: text[j],
        isHanzi: true,
        tonePinyin: tonePinyin,
        untonePinyin: untonePinyin,
        tone: tone,
        arrowTone: arrowTones[tone],
        funikana: funikanaData[untonePinyin],
      });
      j++;
    } else {
      let space = "&nbsp;".repeat(tonePinyin.length + 1);
      retContent.push({
        hanzi: tonePinyin,
        isHanzi: false,
        tonePinyin: space,
        untonePinyin: space,
        tone: 0,
        arrowTone: arrowTones[0],
        funikana: space,
      });
      j += tonePinyin.length;
    }
  }
  return retContent;
}

export function ToHtmlContent(parsedContent, displayMode = 0) {
  // displayMode:
  // 0 标注片假名和箭头音调
  // 1 标注片假名
  // 2 标注有音调拼音
  // 3 标注无音调拼音
  let retContents = [];
  for (let i = 0; i < parsedContent.length; i++) {
    let parsedHanzi = parsedContent[i];
    let content = parsedHanzi.hanzi;
    switch (displayMode) {
      case 0:
        content =
          "<ruby>&nbsp;" +
          content +
          "&nbsp;<rp>(</rp><rt>" +
          parsedHanzi.funikana +
          "</rt><rp>)</rp></ruby><rp>(</rp><rt>" +
          parsedHanzi.arrowTone +
          "</rt><rp>)</rp>";
        break;
      case 1:
        content =
          "&nbsp;" +
          content +
          "&nbsp;<rp>(</rp><rt>" +
          parsedHanzi.funikana +
          "</rt><rp>)</rp>";
        break;
      case 2:
        content =
          "&nbsp;" +
          content +
          "&nbsp;<rp>(</rp><rt>" +
          parsedHanzi.tonePinyin +
          "</rt><rp>)</rp>";
        break;
      case 3:
        content =
          "&nbsp;" +
          content +
          "&nbsp;<rp>(</rp><rt>" +
          parsedHanzi.untonePinyin +
          "</rt><rp>)</rp>";
        break;
      default:
        console.log("mode error!");
        break;
    }
    retContents.push(content);
  }
  return "<ruby>" + retContents.join("") + "</ruby>";
}
