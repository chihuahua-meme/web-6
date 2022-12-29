const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/ajar-stupendous-kettle|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/hexagonal-glitter-vase|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/kindhearted-tundra-milk|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/verbena-secret-ticket|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/shining-cerulean-leather|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/beaded-raspy-singer|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/charmed-fourth-saturday|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/lateral-tin-iguanodon|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/antique-grateful-sodium|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/veiled-incandescent-jumper|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/savory-ember-apatosaurus|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/alert-fierce-baboon|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/natural-good-index|https://0e24a2a7-8fda-4535-b1f4-a70ba5dd071e@api.glitch.com/git/immense-spiffy-stargazer`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();