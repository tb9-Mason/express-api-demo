import { init } from './app';

const port = process.env.PORT || 5000;

(async () => {
  try {
    await init(port);
    console.log(`server started on port ${port}`);
  } catch (e) {
    console.error(e);
  }
})();
