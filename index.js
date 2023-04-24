#! /usr/bin/env node
import open from "open";
import fetch from "node-fetch";
import yargs from "yargs";
import axios from "axios";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";

const { argv } = yargs(process.argv);

const leetcodeUrl = "https://leetcode.com";
const leetcodeApiUrl = "https://leetcode.com/api/problems/all/";

const userProfileName = argv._[2];

const getLeetcodeUserDetails = `https://leetcode-stats-api.herokuapp.com/${userProfileName}`;

const sleep = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

async function showUserData(options) {
  const {
    totalSolved,
    totalQuestions,
    easySolved,
    mediumSolved,
    hardSolved,
    totalEasy,
    totalMedium,
    totalHard,
    acceptanceRate,
    ranking,
  } = options;

  console.clear();
  const msg = "Leetcode Stats";

  figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));

    console.log(`
  ${gradient.pastel.multiline(
    "Total leetcode questions solved:"
  )} ${chalk.bgGreen(totalSolved)} / ${chalk.bgGreen(totalQuestions)}
  ${gradient.pastel.multiline("Easy:")} ${chalk.bgGreen(
      easySolved
    )} / ${chalk.bgGreen(totalEasy)}
  ${gradient.pastel.multiline("Medium:")} ${chalk.bgGreen(
      mediumSolved
    )} / ${chalk.bgGreen(totalMedium)}
  ${gradient.pastel.multiline("Hard:")} ${chalk.bgGreen(
      hardSolved
    )} / ${chalk.bgGreen(totalHard)}
  ${gradient.pastel.multiline("Acceptance Rate: ")} ${chalk.bgGreen(
      acceptanceRate
    )}
  ${gradient.pastel.multiline("Ranking: ")} ${chalk.bgGreen(ranking)}
  `);
  });
}

async function fetchUserData() {
  const spinner = createSpinner("Fetching user data...").start();
  const getUserData = await axios.get(getLeetcodeUserDetails);

  const userData = getUserData.data;

  const options = {
    totalSolved: userData.totalSolved,
    totalQuestions: userData.totalQuestions,
    easySolved: userData.easySolved,
    mediumSolved: userData.mediumSolved,
    hardSolved: userData.hardSolved,
    totalEasy: userData.totalEasy,
    totalMedium: userData.totalMedium,
    totalHard: userData.totalHard,
    acceptanceRate: userData.acceptanceRate,
    ranking: userData.ranking,
  };

  const status = userData.status;
  if (status === "success") {
    spinner.stop();
    await showUserData(options);
  } else {
    spinner.error({ text: "User not found" });
    await sleep();
  }
  //data
  //totalSolved
  //totalQuestions
  //easySolved
  //mediumSolved
  //hardSolved
  //totalEasy
  //totalMedium
  //totalHard
  //acceptanceRate
  //ranking
}

if (argv.print) {
  await fetchUserData();

  // await printUserData(getUserData.data);
} else if (argv.open) {
  await open(`${leetcodeUrl}/${userProfileName}`);
}
