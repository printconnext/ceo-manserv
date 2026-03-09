import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL!;
console.log("DB URL loaded:", connectionString ? "✅ Yes" : "❌ No");

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...");

    // Create user
    const user = await prisma.user.upsert({
        where: { email: "samartch@manserv.co.th" },
        update: {},
        create: {
            email: "samartch@manserv.co.th",
            name: "Samart Chaiya",
            plan: "premium",
        },
    });
    console.log("✅ User created:", user.email);

    // Create organization
    let org = await prisma.organization.findFirst({
        where: { slug: "manserv" }
    });

    if (!org) {
        org = await prisma.organization.create({
            data: {
                slug: "manserv",
                name: "Man Management Service Co., Ltd.",
                logoUrl: "/images/manserv-logo.png",
                userId: user.id,
            }
        });
    }
    console.log("✅ Organization created:", org.slug);

    // Create profile
    const profile = await prisma.profile.upsert({
        where: { orgId_slug: { orgId: org.id, slug: "samart" } },
        update: {},
        create: {
            slug: "samart",
            orgId: org.id,
            fullName: "Samart Chaiya",
            title: "CEO",
            portraitUrl: "/images/ceo-portrait.png",
            phone1: "021925271",
            phone2: "0937893259",
            email: "samartch@manserv.co.th",
            website: "https://www.manserv.co.th",
            lineUrl: "https://line.me/ti/p/fwS0tgCpsb",
            lineQrUrl: "/images/line-qr.png",
        },
    });
    console.log("✅ Profile created:", profile.slug);

    // English translation
    await prisma.profileTranslation.upsert({
        where: { profileId_lang: { profileId: profile.id, lang: "en" } },
        update: {},
        create: {
            profileId: profile.id,
            lang: "en",
            heroBadge: "Founder & CEO",
            heroName: "Samart Chaiya",
            heroTitle: "Man Management Service Co., Ltd.",
            heroQuote: '"We are leading experts in executive road travel, providing executive chauffeur services and rental cars with a driver, backed by over 20 years of experience."',
            heroContact: "Contact Me",
            heroStandard: "Our Standard",
            heroRole: "Chief Executive Officer",
            navAbout: "About",
            navServices: "Services",
            navCustomers: "Key Customers",
            navLookingFor: "Looking For",
            navContact: "Contact",
            aboutData: {
                visionBadge: "My Vision",
                visionTitle: '"International Standard Service <br /> for Supervisor Travel"',
                visionDesc1: "I established Man Management Service with a single goal: to elevate the standard of executive travel in Thailand. We don't just provide cars; we provide peace of mind.",
                visionDesc2: "We are experts in executive automotive travel for leading executives, companies, and factories. With the highest safety standards and intensive training, we ensure every journey is smooth and secure.",
                signature: "Samart Chaiya",
                stats: [
                    { label: "Years Experience", value: "20+" },
                    { label: "Service Trips", value: "4M+" },
                    { label: "Professional Drivers", value: "300+" },
                    { label: "Corporate Clients", value: "100+" },
                ],
                trustText: "Trusted by top-tier organizations across the region.",
            },
            servicesData: {
                title: "Our Services",
                subtitle: "Comprehensive mobility solutions for your business.",
                items: [
                    { title: "Executive Chauffeur", description: "Professional, well-trained drivers with excellent etiquette and route knowledge." },
                    { title: "Limousine Rental", description: "VIP sedans and vans with drivers for specialized executive and corporate travel (Daily/Monthly)." },
                    { title: "Valet Parking", description: "Professional parking management and valet services for hotels, malls, and events." },
                    { title: "Airport Transfer", description: "Punctual, safe, high-quality airport transfer services." },
                    { title: "Driver Training", description: "Defensive Driving and TSM courses to elevate chauffeur standards." },
                    { title: "Lady Chauffeur", description: "Exclusive service with professional female drivers for maximum comfort and privacy." },
                ],
            },
            clientsData: {
                keyCustomersBadge: "KEY CUSTOMERS",
                keyCustomersTitle: "Trusted by Leading Companies",
                lookingForBadge: "LOOKING FOR",
                lookingForTitle: "Our Target Partners",
                lookingForDesc: "We are ready to partner with your organization to elevate your corporate transport standards.",
                lookingForItems: [
                    "Japanese Companies/Factories that utilize Executive Chauffeur services",
                    "Companies requiring long-term Van or SUV rental with drivers",
                    "Corporate Airport Transfer & Vendor Transport services",
                    "Organizations needing Defensive Driving & TSM Training",
                ],
                growingTogether: "Growing Together",
            },
            contactData: {
                title: "Contact",
                subtitle: "Open to speaking engagements, advisory roles, and strategic partnerships.",
                office: "Office",
                mobile: "Mobile",
                email: "Email",
                website: "Website",
                lineTitle: "Add me on LINE",
                clickToAdd: "Click to Add Friend",
                clickToCall: "Click to Call",
                preferEmail: "Prefer email?",
            },
            footerData: { rights: "CEO Profile. All rights reserved." },
        },
    });

    // Thai translation
    await prisma.profileTranslation.upsert({
        where: { profileId_lang: { profileId: profile.id, lang: "th" } },
        update: {},
        create: {
            profileId: profile.id,
            lang: "th",
            heroBadge: "ผู้ก่อตั้งและซีอีโอ",
            heroName: "สามารถ ไชยะ",
            heroTitle: "บริษัท แมน แมนเนจเม้นท์ เซอร์วิส จำกัด",
            heroQuote: '"เราคือ ผู้นำเชี่ยวชาญด้านการเดินทางด้วยรถยนต์ ให้กับผู้บริหาร โดยให้บริการพนักงานขับรถผู้บริหาร และรถเช่าพร้อมคนขับ ด้วยประสบการณ์กว่า 20 ปี บริการมากกว่า 4,00,000 เที่ยว มีพนักงานขับรถกว่า 300 คน ลูกค้ามากกว่า 100 ราย"',
            heroContact: "ติดต่อฉัน",
            heroStandard: "มาตรฐานของเรา",
            heroRole: "ประธานเจ้าหน้าที่บริหาร",
            navAbout: "เกี่ยวกับเรา",
            navServices: "บริการ",
            navCustomers: "ลูกค้าสำคัญ",
            navLookingFor: "กลุ่มเป้าหมาย",
            navContact: "ติดต่อ",
            aboutData: {
                visionBadge: "วิสัยทัศน์",
                visionTitle: '"บริการมาตรฐานสากล <br /> สำหรับการเดินทางระดับผู้บริหาร"',
                visionDesc1: "ผมก่อตั้ง แมน แมนเนจเม้นท์ เซอร์วิส ด้วยเป้าหมายเดียว: ยกระดับมาตรฐานการเดินทางของผู้บริหารในประเทศไทย เราไม่ได้แค่ให้บริการรถยนต์ แต่เรามอบความอุ่นใจ",
                visionDesc2: "เราคือผู้เชี่ยวชาญด้านการเดินทางสำหรับผู้บริหารระดับสูง บริษัท และโรงงานชั้นนำ ด้วยมาตรฐานความปลอดภัยสูงสุดและการฝึกอบรมที่เข้มข้น เราจึงมั่นใจว่าทุกการเดินทางจะราบรื่นและปลอดภัย",
                signature: "สามารถ ไชยะ",
                stats: [
                    { label: "ประสบการณ์ (ปี)", value: "20+" },
                    { label: "เที่ยววิ่งให้บริการ", value: "4M+" },
                    { label: "พนักงานขับรถมืออาชีพ", value: "300+" },
                    { label: "ลูกค้าองค์กร", value: "100+" },
                ],
                trustText: "ได้รับความไว้วางใจจากองค์กรชั้นนำทั่วภูมิภาค",
            },
            servicesData: {
                title: "บริการของเรา",
                subtitle: "โซลูชันการเดินทางครบวงจรสำหรับธุรกิจของคุณ",
                items: [
                    { title: "พนักงานขับรถผู้บริหาร", description: "ผ่านการฝึกฝนอย่างดี มีมารยาทเป็นเลิศ และรู้เส้นทางอย่างดี" },
                    { title: "รถเช่าพร้อมคนขับ", description: "รถ VIP เก๋ง และรถตู้ พร้อมคนขับสำหรับผู้บริหารและองค์กร (รายวัน/รายเดือน)" },
                    { title: "วาเล่ต์พาร์คกิ้ง", description: "บริการจัดการที่จอดรถอย่างมืออาชีพสำหรับโรงแรม ห้าง และงานอีเว้นท์" },
                    { title: "รับ-ส่งสนามบิน", description: "บริการรับส่งสนามบินที่ตรงเวลา ปลอดภัย และคุณภาพสูง" },
                    { title: "ฝึกอบรมพนักงานขับรถ", description: "หลักสูตร Defensive Driving และ TSM เพิ่มมาตรฐานคนขับ" },
                    { title: "พนักงานขับรถหญิง", description: "บริการพิเศษด้วยพนักงานขับรถสตรีมืออาชีพ เพื่อความสบายใจสูงสุด" },
                ],
            },
            clientsData: {
                keyCustomersBadge: "ลูกค้าสำคัญ",
                keyCustomersTitle: "ได้รับความไว้วางใจจากบริษัทชั้นนำ",
                lookingForBadge: "กลุ่มเป้าหมาย",
                lookingForTitle: "พันธมิตรเป้าหมายของเรา",
                lookingForDesc: "เราพร้อมเป็นพันธมิตรกับองค์กรของคุณเพื่อยกระดับมาตรฐานการเดินทาง",
                lookingForItems: [
                    "บริษัท/โรงงานญี่ปุ่น ที่ใช้บริการพนักงานขับรถผู้บริหาร",
                    "บริษัทที่ต้องการเช่ารถตู้/SUV ระยะยาว พร้อมคนขับ",
                    "บริการรับส่งสนามบินองค์กร และ Vendor Transport",
                    "องค์กรที่ต้องการอบรม Defensive Driving & TSM",
                ],
                growingTogether: "เติบโตร่วมกัน",
            },
            contactData: {
                title: "ติดต่อ",
                subtitle: "ยินดีให้คำปรึกษา บรรยาย และความร่วมมือเชิงกลยุทธ์",
                office: "สำนักงาน",
                mobile: "มือถือ",
                email: "อีเมล",
                website: "เว็บไซต์",
                lineTitle: "เพิ่มเพื่อนใน LINE",
                clickToAdd: "คลิกเพื่อเพิ่มเพื่อน",
                clickToCall: "กดเพื่อโทร",
                preferEmail: "สะดวกทางอีเมล?",
            },
            footerData: { rights: "CEO Profile. All rights reserved." },
        },
    });

    // Japanese translation
    await prisma.profileTranslation.upsert({
        where: { profileId_lang: { profileId: profile.id, lang: "ja" } },
        update: {},
        create: {
            profileId: profile.id,
            lang: "ja",
            heroBadge: "創業者 & CEO",
            heroName: "サマート・チャイヤー",
            heroTitle: "Man Management Service Co., Ltd.",
            heroQuote: '"私たちはエグゼクティブの自動車移動における専門家です。20年以上の経験を持ち、専属ドライバーサービスとレンタカー（運転手付き）を提供しています。"',
            heroContact: "お問い合わせ",
            heroStandard: "私たちの基準",
            heroRole: "最高経営責任者",
            navAbout: "会社概要",
            navServices: "サービス",
            navCustomers: "主要顧客",
            navLookingFor: "ターゲット",
            navContact: "お問い合わせ",
            aboutData: {
                visionBadge: "ビジョン",
                visionTitle: '"国際基準のサービス <br /> エグゼクティブの移動のために"',
                visionDesc1: "私はMan Management Serviceを一つの目標で設立しました。タイにおけるエグゼクティブの移動基準を向上させることです。私たちは単に車を提供するのではなく、安心を提供します。",
                visionDesc2: "私たちは大手企業や工場の経営幹部向けの自動車移動の専門家です。最高の安全基準と徹底した研修により、すべての移動がスムーズで安全であることを保証します。",
                signature: "サマート・チャイヤー",
                stats: [
                    { label: "経験年数", value: "20+" },
                    { label: "サービス運行回数", value: "4M+" },
                    { label: "プロドライバー", value: "300+" },
                    { label: "法人顧客", value: "100+" },
                ],
                trustText: "地域全体のトップ企業から信頼されています。",
            },
            servicesData: {
                title: "サービス一覧",
                subtitle: "ビジネスのための総合モビリティソリューション",
                items: [
                    { title: "エグゼクティブ専属ドライバー", description: "マナーとルート知識に優れた、よく訓練されたプロのドライバー。" },
                    { title: "リムジンレンタル", description: "エグゼクティブおよび法人向けのVIPセダン・バン（運転手付き、日単位/月単位）。" },
                    { title: "バレーパーキング", description: "ホテル、商業施設、イベント向けのプロフェッショナルな駐車管理サービス。" },
                    { title: "空港送迎", description: "時間厳守で安全、高品質な空港送迎サービス。" },
                    { title: "ドライバー研修", description: "ディフェンシブドライビングおよびTSMコースでドライバーの基準を向上。" },
                    { title: "女性ドライバー", description: "最大限の快適さとプライバシーを提供する、プロの女性ドライバーによる特別サービス。" },
                ],
            },
            clientsData: {
                keyCustomersBadge: "主要顧客",
                keyCustomersTitle: "大手企業からの信頼",
                lookingForBadge: "ターゲットパートナー",
                lookingForTitle: "求めるパートナー",
                lookingForDesc: "貴社の法人輸送基準を向上させるため、パートナーシップを築く準備ができています。",
                lookingForItems: [
                    "エグゼクティブ専属ドライバーを利用する日系企業・工場",
                    "長期バン・SUVレンタル（運転手付き）を必要とする企業",
                    "法人空港送迎・ベンダー輸送サービス",
                    "ディフェンシブドライビング＆TSM研修を必要とする組織",
                ],
                growingTogether: "共に成長",
            },
            contactData: {
                title: "お問い合わせ",
                subtitle: "講演、アドバイザリー、戦略的パートナーシップのご相談を承っております。",
                office: "オフィス",
                mobile: "携帯電話",
                email: "メール",
                website: "ウェブサイト",
                lineTitle: "LINEで友達追加",
                clickToAdd: "クリックして友達追加",
                clickToCall: "タップして電話",
                preferEmail: "メールをご希望ですか？",
            },
            footerData: { rights: "CEO Profile. All rights reserved." },
        },
    });

    // Chinese translation
    await prisma.profileTranslation.upsert({
        where: { profileId_lang: { profileId: profile.id, lang: "zh" } },
        update: {},
        create: {
            profileId: profile.id,
            lang: "zh",
            heroBadge: "创始人 & CEO",
            heroName: "萨马特·猜亚",
            heroTitle: "Man Management Service Co., Ltd.",
            heroQuote: '"我们是行政座驾出行领域的领先专家，凭借超过20年的经验，提供行政司机服务和带司机的租车服务。"',
            heroContact: "联系我",
            heroStandard: "我们的标准",
            heroRole: "首席执行官",
            navAbout: "关于我们",
            navServices: "服务",
            navCustomers: "主要客户",
            navLookingFor: "目标客户",
            navContact: "联系我们",
            aboutData: {
                visionBadge: "愿景",
                visionTitle: '"国际标准服务 <br /> 为高管出行而设"',
                visionDesc1: "我创办Man Management Service只有一个目标：提升泰国高管出行的标准。我们不仅提供车辆，更提供安心。",
                visionDesc2: "我们是服务领先企业和工厂高管的汽车出行专家。凭借最高的安全标准和严格的培训，我们确保每次出行都顺畅安全。",
                signature: "萨马特·猜亚",
                stats: [
                    { label: "经验年数", value: "20+" },
                    { label: "服务行程", value: "4M+" },
                    { label: "专业司机", value: "300+" },
                    { label: "企业客户", value: "100+" },
                ],
                trustText: "受到全区域顶级企业的信赖。",
            },
            servicesData: {
                title: "我们的服务",
                subtitle: "为您的企业提供全面的出行解决方案。",
                items: [
                    { title: "行政专属司机", description: "经过专业培训、礼仪优秀、熟悉路线的专业司机。" },
                    { title: "豪华轿车租赁", description: "VIP轿车和商务车，配备专业司机，适用于高管和企业出行（日租/月租）。" },
                    { title: "代客泊车", description: "为酒店、商场和活动提供专业停车管理和代客泊车服务。" },
                    { title: "机场接送", description: "准时、安全、高品质的机场接送服务。" },
                    { title: "司机培训", description: "防御性驾驶和TSM课程，提升司机专业标准。" },
                    { title: "女性司机", description: "由专业女性司机提供的尊享服务，确保最大的舒适度和隐私。" },
                ],
            },
            clientsData: {
                keyCustomersBadge: "主要客户",
                keyCustomersTitle: "受到领先企业的信赖",
                lookingForBadge: "目标伙伴",
                lookingForTitle: "我们寻找的合作伙伴",
                lookingForDesc: "我们已准备好与您的企业合作，提升企业交通标准。",
                lookingForItems: [
                    "使用行政司机服务的日资企业/工厂",
                    "需要长期租赁商务车或SUV（配司机）的企业",
                    "企业机场接送和供应商交通服务",
                    "需要防御性驾驶和TSM培训的组织",
                ],
                growingTogether: "共同成长",
            },
            contactData: {
                title: "联系我们",
                subtitle: "欢迎洽谈演讲、顾问及战略合作伙伴关系。",
                office: "办公室",
                mobile: "手机",
                email: "邮箱",
                website: "网站",
                lineTitle: "添加LINE好友",
                clickToAdd: "点击添加好友",
                clickToCall: "点击拨打",
                preferEmail: "更喜欢邮件联系？",
            },
            footerData: { rights: "CEO Profile. All rights reserved." },
        },
    });

    // Hindi translation
    await prisma.profileTranslation.upsert({
        where: { profileId_lang: { profileId: profile.id, lang: "hi" } },
        update: {},
        create: {
            profileId: profile.id,
            lang: "hi",
            heroBadge: "संस्थापक और CEO",
            heroName: "समार्ट चैया",
            heroTitle: "Man Management Service Co., Ltd.",
            heroQuote: '"हम कार्यकारी सड़क यात्रा के अग्रणी विशेषज्ञ हैं, 20 से अधिक वर्षों के अनुभव के साथ कार्यकारी चालक सेवाएं और ड्राइवर सहित किराये की कारें प्रदान करते हैं।"',
            heroContact: "संपर्क करें",
            heroStandard: "हमारा मानक",
            heroRole: "मुख्य कार्यकारी अधिकारी",
            navAbout: "हमारे बारे में",
            navServices: "सेवाएं",
            navCustomers: "प्रमुख ग्राहक",
            navLookingFor: "लक्ष्य",
            navContact: "संपर्क",
            aboutData: {
                visionBadge: "दृष्टिकोण",
                visionTitle: '"अंतर्राष्ट्रीय स्तर की सेवा <br /> कार्यकारी यात्रा के लिए"',
                visionDesc1: "मैंने Man Management Service की स्थापना एक ही लक्ष्य के साथ की: थाईलैंड में कार्यकारी यात्रा के मानक को ऊपर उठाना। हम केवल कारें प्रदान नहीं करते; हम मन की शांति प्रदान करते हैं।",
                visionDesc2: "हम प्रमुख अधिकारियों, कंपनियों और कारखानों के लिए कार्यकारी ऑटोमोटिव यात्रा के विशेषज्ञ हैं। उच्चतम सुरक्षा मानकों और गहन प्रशिक्षण के साथ, हम सुनिश्चित करते हैं कि हर यात्रा सुचारू और सुरक्षित हो।",
                signature: "समार्ट चैया",
                stats: [
                    { label: "वर्षों का अनुभव", value: "20+" },
                    { label: "सेवा यात्राएं", value: "4M+" },
                    { label: "पेशेवर ड्राइवर", value: "300+" },
                    { label: "कॉर्पोरेट ग्राहक", value: "100+" },
                ],
                trustText: "पूरे क्षेत्र के शीर्ष संगठनों द्वारा विश्वसनीय।",
            },
            servicesData: {
                title: "हमारी सेवाएं",
                subtitle: "आपके व्यवसाय के लिए व्यापक गतिशीलता समाधान।",
                items: [
                    { title: "कार्यकारी चालक", description: "उत्कृष्ट शिष्टाचार और मार्ग ज्ञान वाले पेशेवर, अच्छी तरह से प्रशिक्षित ड्राइवर।" },
                    { title: "लिमोसिन रेंटल", description: "कार्यकारी और कॉर्पोरेट यात्रा के लिए ड्राइवर सहित VIP सेडान और वैन (दैनिक/मासिक)।" },
                    { title: "वैलेट पार्किंग", description: "होटलों, मॉल और इवेंट्स के लिए पेशेवर पार्किंग प्रबंधन और वैलेट सेवाएं।" },
                    { title: "एयरपोर्ट ट्रांसफर", description: "समय पर, सुरक्षित, उच्च गुणवत्ता वाली एयरपोर्ट ट्रांसफर सेवाएं।" },
                    { title: "ड्राइवर प्रशिक्षण", description: "चालक मानकों को उन्नत करने के लिए डिफेंसिव ड्राइविंग और TSM पाठ्यक्रम।" },
                    { title: "महिला चालक", description: "अधिकतम आराम और गोपनीयता के लिए पेशेवर महिला ड्राइवरों द्वारा विशेष सेवा।" },
                ],
            },
            clientsData: {
                keyCustomersBadge: "प्रमुख ग्राहक",
                keyCustomersTitle: "अग्रणी कंपनियों द्वारा विश्वसनीय",
                lookingForBadge: "लक्ष्य साझेदार",
                lookingForTitle: "हमारे लक्षित साझेदार",
                lookingForDesc: "हम आपके संगठन के साथ साझेदारी करने के लिए तैयार हैं ताकि कॉर्पोरेट परिवहन मानकों को उन्नत किया जा सके।",
                lookingForItems: [
                    "कार्यकारी चालक सेवाओं का उपयोग करने वाली जापानी कंपनियां/कारखाने",
                    "ड्राइवर सहित दीर्घकालिक वैन या SUV किराये की आवश्यकता वाली कंपनियां",
                    "कॉर्पोरेट एयरपोर्ट ट्रांसफर और वेंडर परिवहन सेवाएं",
                    "डिफेंसिव ड्राइविंग और TSM प्रशिक्षण की आवश्यकता वाले संगठन",
                ],
                growingTogether: "साथ मिलकर बढ़ें",
            },
            contactData: {
                title: "संपर्क करें",
                subtitle: "वक्तव्य, सलाहकार भूमिकाओं और रणनीतिक साझेदारी के लिए संपर्क करें।",
                office: "कार्यालय",
                mobile: "मोबाइल",
                email: "ईमेल",
                website: "वेबसाइट",
                lineTitle: "LINE पर जोड़ें",
                clickToAdd: "मित्र जोड़ने के लिए क्लिक करें",
                clickToCall: "कॉल करने के लिए टैप करें",
                preferEmail: "ईमेल पसंद करते हैं?",
            },
            footerData: { rights: "CEO Profile. All rights reserved." },
        },
    });

    console.log("✅ All translations seeded!");
    console.log("🎉 Database seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
