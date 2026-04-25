
const { translateProfileContent } = require('./src/lib/translator');
const { LOCALES } = require('./src/data/locales');

// Sample Samarth Thai Data (simplified but with key fields)
const samarthThaiData = {
  "heroBadge": "ผู้ก่อตั้งและซีอีโอ",
  "heroName": "สามารถ ไชยะ",
  "heroTitle": "บริษัท แมน แมนเนจเม้นท์ เซอร์วิส จำกัด",
  "heroQuote": "\"เราคือ ผู้นำเชี่ยวชาญด้านการเดินทางด้วยรถยนต์ ให้กับผู้บริหาร โดยให้บริการพนักงานขับรถผู้บริหาร และรถเช่าพร้อมคนขับ ด้วยประสบการณ์กว่า 20 ปี บริการมากกว่า 4,000,000 เที่ยว มีพนักงานขับรถกว่า 300 คน ลูกค้ามากกว่า 100 ราย\"",
  "aboutData": {
    "visionBadge": "วิสัยทัศน์",
    "visionMission": "Vision & Mission",
    "visionTitle": "\"บริการมาตรฐานสากล <br /> สำหรับการเดินทางระดับผู้บริหาร\"",
    "visionDesc1": "ผมก่อตั้ง แมน แมนเนจเม้นท์ เซอร์วิส ด้วยเป้าหมายเดียว: ยกระดับมาตรฐานการเดินทางของผู้บริหารในประเทศไทย เราไม่ได้แค่ให้บริการรถยนต์ แต่เรามอบความอุ่นใจ",
    "visionDesc2": "เราคือผู้เชี่ยวชาญด้านการเดินทางสำหรับผู้บริหารระดับสูง บริษัท และโรงงานชั้นนำ ด้วยมาตรฐานความปลอดภัยสูงสุดและการฝึกอบรมที่เข้มข้น เราจึงมั่นใจว่าทุกการเดินทางจะราบรื่นและปลอดภัย",
    "signature": "สามารถ ไชยะ",
    "stats": [
      { "label": "ประสบการณ์ (ปี)", "value": "20+" },
      { "label": "เที่ยววิ่งให้บริการ", "value": "4M+" },
      { "label": "พนักงานขับรถมืออาชีฟ", "value": "300+" },
      { "label": "ลูกค้าองค์กร", "value": "100+" }
    ]
  },
  "servicesData": {
    "items": [
      {
        "title": "พนักงานขับรถผู้บริหาร",
        "description": "ผ่านการฝึกฝนอย่างดี มีมารยาทเป็นเลิศ และรู้เส้นทางอย่างดี",
        "icon": "user",
        "image": "https://.../img1.png"
      }
    ]
  }
};

async function test() {
    process.env.GOOGLE_TRANSLATE_API_KEY = "AIzaSyDyt0eqv4zZe373xCc_dSwpE5bch3i_cGs";
    console.log("Translating Samarth Thai to Japanese...");
    const result = await translateProfileContent(samarthThaiData, 'ja');
    console.log("Result:", JSON.stringify(result, null, 2));
}

test().catch(console.error);
