import { func } from "prop-types";
import classesCTE from "../assets/tables/classesCTE.json"
import kmodsCTE from "../assets/tables/modificationFactorsCTE.json"

export function getGeometry(parameters){
    // Geometric declarations (they come in cm, need passing to mm)
    const Lvig = parseFloat(parameters.Lvig) * 10;
    const Bvig = parseFloat(parameters.Bvig) * 10;
    const Hvig = parseFloat(parameters.Hvig) * 10;
    const Svig = parseFloat(parameters.Svig) * 10;
    const Ecc = parseFloat(parameters.Ecc) * 10;
    const b1 = Math.max(Svig * (1 - 1.4 * (Svig / Lvig) ** 2), Svig);
    const A1 = b1 * Ecc;
    const A2 = Bvig * Hvig;
    const I1 = (b1 * Ecc ** 3) / 12;
    const I2 = (Bvig * Hvig ** 3) / 12;

    return {
      Lvig: Lvig,
      Bvig: Bvig,
      Hvig: Hvig,
      Svig: Svig,
      Ecc: Ecc,
      b1: b1,
      A1: A1,
      A2: A2,
      I1: I1,
      I2: I2
    }
}

export function getSafetyCoefficients(parameters){
    // Safety coefficients
    const gammaG = parseFloat(parameters.gammaG);
    const gammaQ = parseFloat(parameters.gammaQ);
    const gammaV = parseFloat(parameters.gammaV);
    const gammaM = parseFloat(parameters.gammaM);
    const gammaC = parseFloat(parameters.gammaC);
    const gammaS = parseFloat(parameters.gammaS);
    const gammaSp = parseFloat(parameters.gammaSp);

    return {
      gammaG: gammaG,
      gammaQ: gammaQ,
      gammaV: gammaV,
      gammaM: gammaM,
      gammaC: gammaC,
      gammaS: gammaS,
      gammaSp: gammaSp
    }
}

export function getLoads(parameters, gammaG, gammaQ, densityC, Ecc, Svig, Lvig){
  // Load declarations (they come in kN/m2, need passing to MPa - N/mm2)
  const Pforjado = parseFloat(parameters.Pforjado) / 1000;
  const Pcm = parseFloat(parameters.Pcm) / 1000;
  const Puso = parseFloat(parameters.Puso) / 1000;
  const Pcc = Ecc * (densityC / 1000000);
  const qperm = Pforjado + Pcc + Pcm;
  const qmed = Puso;
  const qratioperm = qperm / (qperm + qmed);
  const qratiomed = qmed / (qperm + qmed);

  // Loads for design
  const Gelu = gammaG * qperm + gammaQ * qmed;
  const Gels = qperm + qmed;
  const Mdv = (Gelu * Svig * Lvig ** 2) / 8;
  const Vdv = (Gelu * Svig * Lvig) / 2;

  return {
    qmed:  qmed,
    qperm: qperm,
    qratiomed: qratiomed,
    qratioperm: qratioperm,
    Gels: Gels,
    Gelu: Gelu,
    Mdv: Mdv,
    Vdv: Vdv
  }
}

export function getConcreteProperties(parameters, gammaC){
    // Concrete parameters (in MPa=N/mm2)
    const Es = 200000;
    const densityC = 25;
    const psi1p = 2.25;
    const psimed = 1.35;

    const fck = parseFloat(parameters.fck);
    const tractionCoeff = fck > 50 ? 0.58 : 0.3;
    const fcd = fck / gammaC;
    const f1cd = fcd * 0.6;
    const fcm =  fck + 8;
    const fctm = tractionCoeff * fck**(2/3);
    const fctmd = fctm / gammaC;
    const fctfl = 0.37 * fck**(2/3);
    const Ec = 8500 * fcm**(1/3);

    return {
      fck: fck,
      fctmd: fctmd,
      fctfl: fctfl,
      f1cd: f1cd,
      fcd: fcd,
      Ec: Ec,
      Es: Es,
      densityC: densityC,
      psi1p: psi1p,
      psimed: psimed
    }
}

export function getConnectorProperties(parameters, gammaS){
    // Connectors parameters (in MPa=N/mm2, mm)
    const fyk = parseFloat(parameters.fyk);
    const fyd = fyk / gammaS;
    const fyalphad = Math.min(fyd, 400);
    const Dcon = parseFloat(parameters.Dcon);
    const Smax = parseFloat(parameters.Smax);
    const Smin = parseFloat(parameters.Smin);
    const Hcon = parseFloat(parameters.Hcon);
    const Pcon = parseFloat(parameters.Pcon);
    const Pangle = parseFloat(parameters.Pangle);
    const Sef = 0.75 * Smin + 0.25 * Smax;
    const Sratio = Smax / (4 * Smin);

    return {
      fyk: fyk,
      fyd:fyd,
      fyalphad: fyalphad,
      Dcon: Dcon,
      Smax: Smax,
      Smin: Smin,
      Hcon: Hcon,
      Pcon: Pcon,
      Pangle: Pangle,
      Sef: Sef,
      Sratio: Sratio
    }
}

export function getWoodProperties(parameters, loads, gammaM, Dcon){

  // Wood parameters (they come in different units)
  const woodClass = parameters.ClaseMadera;
  const serviceClass = parameters.ClaseServicio;

  const woodProps = classesCTE[woodClass];
  const kmods = kmodsCTE[serviceClass];

  // Wood properties
  const E2 = woodProps.E0medio * 1000;
  const ft0k = woodProps.ft0k;
  const fmk = woodProps.fmk;
  const fvk = woodProps.fvk;
  const Kser = 2 * (woodProps.romedio ** 1.5) * Dcon / 23;
  const Ku = 2 * Kser / 3;
  const rok = woodProps.rok;

  const kmoddef = loads.qratioperm * kmods.kmod1 + loads.qratiomed * kmods.kmodm;
  const ft0d = kmoddef * ft0k / gammaM;
  const fmd = kmoddef * fmk / gammaM;
  kmods['kmoddef'] = kmoddef;

  return {
    kmods: kmods,
    E2: E2,
    ft0k: ft0k,
    fmk: fmk,
    fvk: fvk,
    ft0d: ft0d,
    fmd: fmd,
    Kser: Kser,
    Ku: Ku,
    rok: rok
  }
}

export function computeBendingULS(concrete, 
                                  wood,
                                  geometry,
                                  sectionCorrectors,
                                  loads,
                                  Eef1,
                                  Eef2
                                  ){

  const sigma1 = (sectionCorrectors.gamma * Eef1 * sectionCorrectors.a1 * loads.Mdv) / sectionCorrectors.EIef;
  const sigmam1 = (0.5 * Eef1 * geometry.Ecc * loads.Mdv) / sectionCorrectors.EIef;
  const sigma2 = (Eef2 * sectionCorrectors.a2 * loads.Mdv) / sectionCorrectors.EIef;
  const sigmam2 = (0.5 * Eef2 * geometry.Hvig * loads.Mdv) / sectionCorrectors.EIef;
  const sigmac1d = sigma1 + sigmam1;
  const sigmat1d = sigmam1 - sigma1

  const compressionRatio = sigmac1d / concrete.fcd;
  const tensionRatio = sigmat1d / concrete.fctmd;
  const woodFlexoTractionRatio = (sigma2 / wood.ft0d) + (sigmam2 / wood.fmd);

  return {compressionRatio: compressionRatio,
          tensionRatio: tensionRatio,
          woodFlexoTractionRatio: woodFlexoTractionRatio}
}

export function computeSectionCorrectors(
                                        connectors,
                                        geometry, 
                                        Eef1,
                                        Eef2,
                                        K1){

  const gamma = 1 / (1 + ((Eef1 * geometry.A1 * connectors.Sef * Math.PI**2)/(K1 * geometry.Lvig ** 2)));
  const a2 = (gamma * Eef1 * geometry.A1 * (geometry.Ecc + geometry.Hvig)) / (2 * (Eef1 * geometry.A1 * gamma + Eef2 * geometry.A2));
  const a1 = 0.5 * (geometry.Ecc + geometry.Hvig) - a2;
  const EIef = Eef1 * geometry.I1 + 
              gamma * Eef1 * geometry.A1 * a1**2 + 
              Eef2 * geometry.I2 + 
              Eef2 * geometry.A2 * a2**2;

  return {
    gamma: gamma,
    a1: a1,
    a2: a2,
    EIef: EIef}
}

export function computeShearULS(coefficients,
                                wood,
                                geometry, 
                                sectionCorrectors,
                                loads,
                                Eef2,
                                kmod
                                ){

  // Tangent tensions ELU
  const tau2max = (loads.Vdv * 0.5 * Eef2 * geometry.Bvig * (0.5 * geometry.Hvig + sectionCorrectors.a2)**2) / (geometry.Bvig * sectionCorrectors.EIef);
  const fvd = kmod * wood.fvk / coefficients.gammaM;

  const woodShearRatio = tau2max / fvd;

  return woodShearRatio;
}

export function computeUnionsULS(coefficients,
                                concrete,
                                wood,
                                connectors,
                                geometry, 
                                sectionCorrectors,
                                loads,
                                Eef1){
    // ELU unions
    const Funion = (sectionCorrectors.gamma * Eef1 * geometry.A1 * sectionCorrectors.a1 *  connectors.Sef * loads.Vdv) / sectionCorrectors.EIef;
    const slenderness = geometry.Hcon / connectors.Dcon;
    let alpha = 1;
    if (3 < slenderness && slenderness < 4){
      alpha = 0.2 * (slenderness + 1)
    }
  
    const Rdh = (0.29 * alpha * connectors.Dcon**2) * Math.sqrt(concrete.fck * concrete.Ec / coefficients.gammaV);
    const Rdst = 0.8 * connectors.fyk * (0.25 * Math.PI * connectors.Dcon**2 ) / coefficients.gammaV;
    const fh0k = 0.082 * (1 - 0.01 * connectors.Dcon) * wood.rok;
    const k90 = 1.35 + 0.015 * connectors.Dcon;
    const boltAngleRadians = (connectors.Pangle * Math.PI) / 180.0;
    
    const fh90k = fh0k / ((k90 * Math.sin(boltAngleRadians)**2) + Math.cos(boltAngleRadians)**2);
    const fh90d = wood.kmods.kmod1 * fh90k / coefficients.gammaM;
    
    const Myk = (0.8 * connectors.fyk * connectors.Dcon**3) / 6;
    const Myd = Myk / coefficients.gammaSp;
    const Rdm1 = 1.1 * fh90d * connectors.Pcon * connectors.Dcon * ((Math.sqrt(2 + (4 * Myd / (fh90d * connectors.Dcon * connectors.Pcon**2)))) -1);
    const Rdm2 = 1.5 * Math.sqrt(2 * Myd * fh90d * connectors.Dcon);

    const Rd = Math.min(Rdh, Rdst, Rdm1, Rdm2);
  
    const unionRatio = Funion / Rd;

    return unionRatio;
}

export function computeDeflection(concrete,
                                  wood,
                                  connectors,
                                  geometry,
                                  psi,
                                  kdef,
                                  q){
  const E1flu = concrete.Ec / (1 + psi);
  const E2flu = wood.E2 / (1 + kdef);
  const gammaELSflu = 1 / (1 + ((E1flu * geometry.A1 * connectors.Sef * Math.PI**2)/(wood.Kser * geometry.Lvig ** 2)));
  const a2flu =  (gammaELSflu * E1flu * geometry.A1 * 
                  (geometry.Ecc + geometry.Hvig)) / 
                  (2 * (E1flu * geometry.A1 * gammaELSflu + 
                    E2flu * geometry.A2));

  const a1flu = 0.5 * (geometry.Ecc + geometry.Hvig) - a2flu;
  const EIefflu = E1flu * geometry.I1 + 
                      gammaELSflu * E1flu * geometry.A1 * a1flu**2 + 
                      E2flu * geometry.I2 + 
                      E2flu * geometry.A2 * a2flu**2;
  const fflu = (5 * q * geometry.Svig * geometry.Lvig**4) / (384 * EIefflu);
  
  return fflu
}
export function computeDeflectionSLS(
                                  concrete,
                                  wood,
                                  connectors,
                                  geometry, 
                                  sectionCorrectors,
                                  loads
                                  ){
    
      const fpermelas = (5 * loads.qperm * geometry.Svig * geometry.Lvig**4) / (384 * sectionCorrectors.EIef);
      const fmedelas = (5 * loads.qmed * geometry.Svig * geometry.Lvig**4) / (384 * sectionCorrectors.EIef);
      const felas = fpermelas + fmedelas;
      
      const fpermflu = computeDeflection(concrete,
                                          wood,
                                          connectors,
                                          geometry,
                                          concrete.psi1p,
                                          wood.kmods.kdefperm,
                                          loads.qperm)
      
      const fmedflu = computeDeflection(concrete,
                                          wood,
                                          connectors,
                                          geometry,
                                          concrete.psimed,
                                          wood.kmods.kdefmed,
                                          loads.qmed)

      const ftotalflu = fpermflu + fmedflu;
      
      const fratio = geometry.Lvig / ftotalflu;

      return fratio
}


export function handler(event, context, callback) {
  console.log('queryStringParameters', event.queryStringParameters)
  const parameters = event.queryStringParameters;

  const coefficients = getSafetyCoefficients(parameters);
  console.log('Coefficients:', coefficients);

  const geometry = getGeometry(parameters);
  console.log('Geometry:', geometry);

  const loads = getLoads(parameters, 
    coefficients.gammaG, 
    coefficients.gammaQ, 
    concrete.densityC,
    geometry.Ecc,
    geometry.Svig,
    geometry.Lvig
    );
  console.log('Loads:', loads);

  const connectors = getConnectorProperties(parameters, coefficients.gammaS);
  console.log('Connectors:', connectors);

  const wood = getWoodProperties(parameters, loads, coefficients.gammaM, connectors.Dcon);
  console.log('Wood:', wood);

  const concrete = getConcreteProperties(parameters, coefficients.gammaC)
  console.log('Concrete:', concrete);

  const sectionCorrectors = computeSectionCorrectors(connectors, 
                                                      geometry, 
                                                      concrete.Ec, 
                                                      wood.E2, 
                                                      wood.Ku);

  const shortTermBending = computeBendingULS(concrete, 
                                              wood,
                                              geometry, 
                                              sectionCorrectors,
                                              loads,
                                              concrete.Ec,
                                              wood.E2
                                              );
                

  const shortTermShear = computeShearULS(parameters,
                                        wood,
                                        geometry,
                                        sectionCorrectors,
                                        loads,
                                        wood.E2
                                        );
  
  const shortTermUnions = computeUnionsULS(coefficients,
                                            concrete, 
                                            wood,
                                            connectors,
                                            geometry, 
                                            sectionCorrectors,
                                            loads,
                                            concrete.Ec
                                            )
  const kdefperm = wood.kdefperm;
  const kdefmed = wood.kdefmed;

  const Eef1 = concrete.Ec * (loads.qratioperm / (1 + concrete.psi1p) + (loads.qratiomed / (1 + concrete.psimed)));
  const Eef2 = wood.E2 * (loads.qratioperm / (1 + wood.kmods.kdefperm) + (loads.qratiomed / (1 + wood.kmods.kdefmed)));
  const kdef = loads.qratioperm * wood.kmods.kdefperm + loads.qratiomed * wood.kmods.kdefmed;
  const Kufin = wood.Ku / (1 + wood.kmods.kdef);
  const K1 = Kufin;                                        

  sectionCorrectors = computeSectionCorrectors(connectors, 
                                                geometry, 
                                                Eef1, 
                                                Eef2, 
                                                K1);

  const longTermBending = computeBendingULS(concrete, 
                                              wood,
                                              geometry, 
                                              sectionCorrectors,
                                              loads,
                                              Eef1,
                                              Eef2
                                              );
                

  const longTermShear = computeShearULS(coefficients,
                                        wood,
                                        geometry,
                                        sectionCorrectors,
                                        loads,
                                        Eef2
                                        );


  const longTermUnions = computeUnionsULS(coefficients,
                                          concrete, 
                                          wood,
                                          connectors,
                                          geometry, 
                                          sectionCorrectors,
                                          loads,
                                          Eef1
                                          )

  sectionCorrectors = computeSectionCorrectors(connectors, 
                                            geometry, 
                                            concrete.Ec, 
                                            wood.E2, 
                                            wood.Kser);    

  const deflection = computeDeflectionSLS(concrete, 
                                          wood,
                                          connectors,
                                          geometry, 
                                          sectionCorrectors,
                                          loads
                                          )

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({shortTermBending: {shortTermBending}, 
                          shortTermShear: {shortTermShear},
                          shortTermUnions: {shortTermUnions},
                          longTermBending: {longTermBending}, 
                          longTermShear: {longTermShear},
                          longTermUnions: {longTermUnions},
                          deflection: {deflection}
                        }),
  })
}
