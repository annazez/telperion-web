
const routeMap = {
  "/kontakty": "/en/contacts",
  "/clanky": "/en/articles",
  "/programy/pro-skoly": "/en/workshops/for-schools",
  "/programy/pro-verejnost": "/en/workshops/for-public",
  "/programy/dalsi-programy": "/en/workshops/other",
};

const ITERATIONS = 1000000;

function originalLogic(currentPath, isEn) {
  let csPath = "/";
  let enPath = "/en/";

  if (isEn) {
    enPath = currentPath;
    let found = false;
    for (const [czBase, enBase] of Object.entries(routeMap)) {
      if (currentPath === enBase) {
        csPath = czBase;
        found = true;
        break;
      } else if (currentPath.startsWith(`${enBase}/`)) {
        csPath = currentPath.replace(enBase, czBase);
        found = true;
        break;
      }
    }
    if (!found) {
      csPath = currentPath.replace(/^\/en(?=\/|$)/, "") || "/";
    }
  } else {
    csPath = currentPath || "/";
    let found = false;
    for (const [czBase, enBase] of Object.entries(routeMap)) {
      if (currentPath === czBase) {
        enPath = enBase;
        found = true;
        break;
      } else if (currentPath.startsWith(`${czBase}/`)) {
        enPath = currentPath.replace(czBase, enBase);
        found = true;
        break;
      }
    }
    if (!found) {
      enPath = `/en${currentPath === "/" ? "" : currentPath}`;
    }
  }
  return { csPath, enPath };
}

const reverseRouteMap = Object.fromEntries(
  Object.entries(routeMap).map(([cz, en]) => [en, cz])
);
const routeEntries = Object.entries(routeMap);

function optimizedLogic(currentPath, isEn) {
  let csPath = "/";
  let enPath = "/en/";

  if (isEn) {
    enPath = currentPath;

    // O(1) exact match
    const exactMatch = reverseRouteMap[currentPath];
    if (exactMatch) {
        csPath = exactMatch;
    } else {
        let found = false;
        for (let i = 0; i < routeEntries.length; i++) {
            const [czBase, enBase] = routeEntries[i];
            if (currentPath.startsWith(`${enBase}/`)) {
                csPath = currentPath.replace(enBase, czBase);
                found = true;
                break;
            }
        }
        if (!found) {
            csPath = currentPath.replace(/^\/en(?=\/|$)/, "") || "/";
        }
    }
  } else {
    csPath = currentPath || "/";

    // O(1) exact match
    const exactMatch = routeMap[currentPath];
    if (exactMatch) {
        enPath = exactMatch;
    } else {
        let found = false;
        for (let i = 0; i < routeEntries.length; i++) {
            const [czBase, enBase] = routeEntries[i];
            if (currentPath.startsWith(`${czBase}/`)) {
                enPath = currentPath.replace(czBase, enBase);
                found = true;
                break;
            }
        }
        if (!found) {
            enPath = `/en${currentPath === "/" ? "" : currentPath}`;
        }
    }
  }
  return { csPath, enPath };
}

const testPaths = [
    { path: "/en/contacts", isEn: true },
    { path: "/kontakty", isEn: false },
    { path: "/en/workshops/for-schools/extra", isEn: true },
    { path: "/programy/pro-skoly/extra", isEn: false },
    { path: "/unknown", isEn: false },
    { path: "/en/unknown", isEn: true },
];

console.log("Running baseline...");
const startBaseline = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    for (const test of testPaths) {
        originalLogic(test.path, test.isEn);
    }
}
const endBaseline = performance.now();
console.log(`Baseline: ${endBaseline - startBaseline}ms`);

console.log("Running optimized...");
const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    for (const test of testPaths) {
        optimizedLogic(test.path, test.isEn);
    }
}
const endOptimized = performance.now();
console.log(`Optimized: ${endOptimized - startOptimized}ms`);

const improvement = ((endBaseline - startBaseline) - (endOptimized - startOptimized)) / (endBaseline - startBaseline) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}%`);
