import Telnet from "telnet-client";
import { promises } from "dns";

export default async (email: any) => {
  const domain = email.split("@")[1];
  let connection = new Telnet();
  const mxResolved = await promises.resolveMx(domain);
  const exchange = mxResolved[0].exchange;

  let params = {
    host: exchange,
    negotiationMandatory: false,
    port: 25,
    timeout: 15000,
  };

  try {
    await connection.connect(params);
  } catch (error) {
    console.error(error);
  }
  const helo = await connection.send(`HELO ${exchange}`, {
    ors: "\r\n",
    waitfor: "\n",
  });
  const mailFrom = await connection.send(`MAIL FROM: <${email}>`, {
    ors: "\r\n",
    waitfor: "\n",
  });
  const recepientTo = await connection.send(`RCPT TO: <${email}>`, {
    ors: "\r\n",
    waitfor: "\n",
  });
  console.log("");
  console.log("helo", helo);
  console.log("mailFrom", mailFrom);
  console.log("recepientTo", recepientTo);
  await connection.destroy();
};
