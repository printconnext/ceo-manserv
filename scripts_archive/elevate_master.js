const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const masterEmail = 'printconnext@gmail.com';
    console.log(`Elevating account: ${masterEmail} to 'diamond' plan...`);

    try {
        const user = await prisma.user.update({
            where: { email: masterEmail },
            data: { plan: 'diamond' },
        });
        console.log('Success! User updated:', user);
    } catch (error) {
        if (error.code === 'P2025') {
            console.log(`User with email ${masterEmail} not found. They might need to sign in first.`);
        } else {
            console.error('Error updating user:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
