import Constants from "expo-constants";

const ENV = {
  dev: {
    apiUrl: "[your.dev.api.here]",
    diarioPdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=[your.dev.report.api.here]",
  },
  staging: {
    apiUrl: "[your.staging.api.here]",
    diarioPdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=[your.staging.report.api.here]",
  },
  prod: {
    apiUrl: "[your.prod.api.here]",
    diarioPdf: "https://drive.google.com/viewerng/viewer?embedded=true&url=[your.prod.report.api.here]",
  }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;