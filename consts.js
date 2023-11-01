module.exports = Object.freeze({
  getBaseUrl: () => {
    // ambiente local
    if (!process.env.RAILWAY_PUBLIC_DOMAIN) {
      return process.env.HOST_NAME;
    }

    // ambiente de produccion
    let baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN;

    // railway no incluye el protocolo en esta variable de entorno, por lo que hay que agregarselo
    if (!baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl;
    }

    return baseUrl;
  },
});
