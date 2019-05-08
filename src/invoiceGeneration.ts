import { getRepository, Between } from "typeorm";
import { Passage } from "./models/passage";
import { Invoice } from "./models/invoice";

const duration = 10 * 60; // currently 10 minutes
const dueDuration = 20 * 60; // currently 20 minues

export default setInterval(async () => {
  const passages = await getRepository(Passage).find({
    where: {
      time: Between(new Date(Date.now() - duration * 1000), new Date())
    }
  });
  if (passages.length === 0) {
    return;
  }
  const passagesByUser = passages.reduce((acc, current) => {
    const personalId = current.userId;
    if (!(personalId in acc)) {
      acc[personalId] = []
    }
    acc[personalId].push(current);
    return acc;
  }, {} as {
    [key: string]: Array<Passage>;
  });
  const invoices = Object.keys(passagesByUser).map((personalId) =>
    ({
      amount: passagesByUser[personalId].reduce((acc, current) => acc += current.price, 0),
      paid: false,
      dueDate: new Date(Date.now() + dueDuration * 1000),
      issueDate: new Date,
      userId: personalId
    }));
  await getRepository(Invoice).insert(invoices);

}, duration * 1000);
