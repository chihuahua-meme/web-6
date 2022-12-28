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


const listProject = `https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/scented-green-mammal|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/silent-ringed-newsstand|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/tall-oil-strawflower|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/colorful-certain-legal|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/spotted-local-engine|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/unmarred-nebulous-conkerberry|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/familiar-mature-vault|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/steel-delicate-zydeco|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/great-humdrum-verse|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/sun-sparkling-sulfur|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/pyrite-sunset-alamosaurus|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/lucky-humble-water|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/stream-low-radar|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/beaded-acoustic-snake`.trim().split('|');

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