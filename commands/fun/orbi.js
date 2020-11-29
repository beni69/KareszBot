module.exports = {
    aliases: ['vitya', 'mester'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        function calculate_age(dob) {
            const diff_ms = Date.now() - dob.getTime();
            const age_dt = new Date(diff_ms);
            const ageY = Math.abs(age_dt.getFullYear() - 1970);
            const ageM = age_dt.getMonth();
            const ageD = age_dt.getDay();
            const ageH = age_dt.getHours();
            const ageMin = age_dt.getMinutes();
            const ageSec = age_dt.getSeconds();

            return `Viktor ${ageY} év, ${ageM} hónap, ${ageD} nap, ${ageH} óra, ${ageMin} perc, ${ageSec} másodperce született.`;
            // return `${Math.abs(age_dt.getFullYear() - 1970)} év, ${}`;
        }


        // dob = 05311963;
        // 1963 may 31 09:51
        // dateObj = new Date(Date.now() + 207972540000)
        message.channel.send(calculate_age(new Date(1963, 04, 31, 09, 51)));

        // cmdlog.Log(client, message);
    }
};
