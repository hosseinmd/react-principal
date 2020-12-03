import path from "path";
import fse from "fs-extra";

function generateStore(destination: string, { cwd }: { cwd: string }) {
  console.log(destination, cwd);

  fse.copySync(
    path.join(__dirname, "../../files/sample"),
    path.join(cwd, destination),
  );
}

export default generateStore;
