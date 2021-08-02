import { createSMSModule } from 'sipgateio';

//const recipient = "0203-928694653";
//const smsId = "s0";
//const timestamp = Date.now();
//console.log(timestamp);
//const sendAt = (timestamp.getTime() / 1000).toString();
//console.log(sendAt);
var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


export async function sendSms(message, client) {
    const smsModule = createSMSModule(client);

        smsModule.send({
            smsId: 's0',
            to: '+49203928694650',
            message: message,
            datetime
        })

    console.log("SMS gesendet:" + message);
}
