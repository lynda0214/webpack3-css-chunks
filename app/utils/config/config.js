const env = process.env.PROFILE || 'development';
export default require('./' + env);
