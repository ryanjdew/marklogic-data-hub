import axios from "axios";
import {testMatchingActivity} from "../assets/mock-data/curation/matching.data";

export const updateMatchingArtifact = async (matching) => {
  try {
    let response = await axios.put(`/api/steps/matching/${matching.name}`, matching);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    let message = error;
    console.error("Error while updating the matching step!", message);
    return false;
  }
};

export const calculateMatchingActivity = async (matchStepName) => {
  try {
    let response = await axios.get(`/api/steps/matching/${matchStepName}/calculateMatchingActivity`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    let message = error;
    console.error("Error while fetching the match activity!", message);
  }
};

export const previewMatchingActivity = async (testMatchData) => {
  try {
    let response = testMatchingActivity;
    return response;
  // Will update it once backend code is integrated
  //  let response = await axios.post(`/api/steps/matching/${testMatchData.stepName}/previewMatchingActivity?sampleSize=${testMatchData.sampleSize}&uris=${testMatchData.uris}`);
  //   if (response.status === 200) {
  //     return response.data;
  //   }
  } catch (error) {
    let message = error;
    console.error("Error while fetching the match activity!", message);
  }
};
