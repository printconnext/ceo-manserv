
const { googleTranslateBatch } = require('./src/lib/translator');

async function test() {
    process.env.GOOGLE_TRANSLATE_API_KEY = "AIzaSyDyt0eqv4zZe373xCc_dSwpE5bch3i_cGs";
    const quote = "\"เราคือ ผู้นำเชี่ยวชาญด้านการเดินทางด้วยรถยนต์ ให้กับผู้บริหาร โดยให้บริการพนักงานขับรถผู้บริหาร และรถเช่าพร้อมคนขับ ด้วยประสบการณ์กว่า 23 ปี บริการมากกว่า 4,000,000 เที่ยว มีพนักงานขับรถกว่า 300 คน ลูกค้ามากกว่า 200 ราย\"";
    const address = "8/69 ถนนวิภาวดีรังสิต แขวงสนามบิน เขตดอนเมือง กรุงเทพฯ 10210";

    console.log("Translating Quote and Address to ZH...");
    try {
        const results = await googleTranslateBatch([quote, address], 'zh');
        console.log("Results:", JSON.stringify(results, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

test().catch(console.error);
