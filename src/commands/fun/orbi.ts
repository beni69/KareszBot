import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: ["orbi", "vitya", "mester"] },
    ({ message }) => {
        // 1963 may 31 09:51

        const dob = new Date(1963, 5, 31, 9, 51);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        const ageY = Math.abs(age_dt.getFullYear() - 1970);
        const ageM = age_dt.getMonth();
        const ageD = age_dt.getDay();
        const ageH = age_dt.getHours();
        const ageMin = age_dt.getMinutes();
        const ageSec = age_dt.getSeconds();

        message.channel.send(
            `Viktor ${ageY} év, ${ageM} hónap, ${ageD} nap, ${ageH} óra, ${ageMin} perc, ${ageSec} másodperce született.`
        );
    }
);
