import Keycloak from 'keycloak-js'

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

let keycloakInstance: Keycloak | null = null

export const getKeycloak = () => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig)
  }
  return keycloakInstance
}

export const resetKeycloak = () => {
  keycloakInstance = null
}
    
export default getKeycloak()
