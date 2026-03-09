import ProfileForm from "@/components/ProfileForm";

export default function NewProfilePage() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">สร้างโปรไฟล์ใหม่</h1>
                <p className="text-gray-600">กรอกข้อมูลเพื่อสร้างหน้าโปรไฟล์ดิจิทัลใหม่ของคุณ (Diamond Member Only)</p>
            </div>

            <ProfileForm />
        </div>
    );
}
