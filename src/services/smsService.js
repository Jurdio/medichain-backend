const axios = require('axios');

const TURBOSMS_TOKEN = process.env.TURBOSMS_TOKEN;
const TURBOSMS_SENDER = 'TAXI';

async function sendSMS({ to, message }) {
    try {
        const body = {
            recipients: [to],
            sms: {
                sender: TURBOSMS_SENDER,
                text: message,
            },
        };

        const res = await axios.post('https://api.turbosms.ua/message/send.json', body, {
            headers: {
                Authorization: `Bearer ${TURBOSMS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (res.data.status === 200) {
            console.log('✅ SMS відправлено:', res.data.messages[0]);
        } else {
            console.error('❌ TurboSMS error:', res.data);
        }
    } catch (error) {
        console.error('❌ Axios error:', error.response?.data || error.message);
    }
}

module.exports = { sendSMS };
