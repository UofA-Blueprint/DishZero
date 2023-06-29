import nodeConfig from 'config';

export const getFeatureFlag = (featureFlag: string) =>  {
    if (nodeConfig.has(`featureFlags.${featureFlag}`)) {
        return nodeConfig.get(`featureFlags.${featureFlag}`)
    } else {
        return false
    }
}
