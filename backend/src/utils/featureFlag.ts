import nodeConfig from 'config'

/**
 * retuns the value of the feature flag from the config file.
 * If the feature flag is not found, it returns false
 * @param featureFlag String
 * @returns Boolean
 */
export const getFeatureFlag = (featureFlag: string) => {
    if (nodeConfig.has(`featureFlags.${featureFlag}`)) {
        return nodeConfig.get(`featureFlags.${featureFlag}`)
    } else {
        return false
    }
}
