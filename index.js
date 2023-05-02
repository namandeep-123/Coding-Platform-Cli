#! /usr/bin/env node
import open from "open";
import yargs from "yargs";
import axios from "axios";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import {
  ACCEPTANCE_RATE,
  BANNER_MESSAGE,
  EASY,
  FETCHING_USER_DATA,
  HARD,
  LEETCODE_GET_USER_DETAILS,
  LEETCODE_PROBLEMS_URL,
  LEETCODE_URL,
  MEDIUM,
  RANKING,
  SUCCESS,
  TOTAL_QUESTIONS_SOLVED,
  USERNAME,
  USER_NOT_FOUND,
} from "./constants.js";

const { argv } = yargs(process.argv);

const leetcodeUrl = LEETCODE_URL;
const leetcodeApiUrl = LEETCODE_PROBLEMS_URL;

const userProfileName = argv._[2];

const getLeetcodeUserDetails = `${LEETCODE_GET_USER_DETAILS}/${userProfileName}`;

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
  const msg = BANNER_MESSAGE;

  figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));

    console.log(`
  ${gradient.pastel.multiline(USERNAME)} ${chalk.green(userProfileName)}
  ${gradient.pastel.multiline(TOTAL_QUESTIONS_SOLVED)} ${chalk.green(
      totalSolved
    )} / ${chalk.green(totalQuestions)}
  ${gradient.pastel.multiline(EASY)} ${chalk.green(easySolved)} / ${chalk.green(
      totalEasy
    )}
  ${gradient.pastel.multiline(MEDIUM)} ${chalk.green(
      mediumSolved
    )} / ${chalk.green(totalMedium)}
  ${gradient.pastel.multiline(HARD)} ${chalk.green(hardSolved)} / ${chalk.green(
      totalHard
    )}
  ${gradient.pastel.multiline(ACCEPTANCE_RATE)} ${chalk.green(acceptanceRate)}
  ${gradient.pastel.multiline(RANKING)} ${chalk.green(ranking)}
  `);
  });
}

async function fetchUserData() {
  const spinner = createSpinner(FETCHING_USER_DATA).start();
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
  if (status === SUCCESS) {
    spinner.stop();
    await showUserData(options);
  } else {
    spinner.error({ text: USER_NOT_FOUND });
    await sleep();
  }
}

if (argv.print) {
  await fetchUserData();
} else if (argv.open) {
  await open(`${leetcodeUrl}/${userProfileName}`);
}
