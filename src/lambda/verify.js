import classesCTE from "../assets/tables/classesCTE.json"
import kmodsCTE from "../assets/tables/modificationFactorsCTE.json"

export function handler(event, context, callback) {
  console.log('queryStringParameters', event.queryStringParameters)
  const parameters = event.queryStringParameters;

  const densityC = 25;
  // Concrete parameters (in MPa=N/mm2)
  const fck = parseFloat(parameters.fck);
  const gammaC = parseFloat(parameters.gammaC);
  const tractionCoeff = fck > 50 ? 0.58 : 0.3;
  const fcd = fck / gammaC;
  const f1cd = fcd * 0.6;
  const fcm =  fck + 8;
  const fctm = tractionCoeff * fck**(2/3);
  const fctmd = fctm / gammaC;
  const fctfl = 0.37 * fck**(2/3);
  const Ec = 8500 * fcm**(1/3);
  
  console.log({'fck': fck,
              'gammaC': gammaC,
              'tractionCoeff': tractionCoeff, 
              'fcd': fcd, 
              'f1cd': f1cd, 
              'fcm': fcm, 
              'fctm': fctm, 
              'fctmd': fctmd, 
              'fctfl': fctfl, 
              'Ec': Ec}
              )
  // Wood parameters (they come in different units)
  const woodClass = parameters.ClaseMadera;
  const serviceClass = parameters.ClaseServicio;
  const woodProps = classesCTE[woodClass];
  const kmods = kmodsCTE[serviceClass];

  // Connectors parameters (in MPa=N/mm2)
  const fyk = parseFloat(parameters.fyk);
  const gammaS = parseFloat(parameters.gammaS);
  const fyd = fyk / gammaS;
  const fyalphad = Math.min(fyd, 400);
  const Es = 200000;

  console.log({
    'fyk':fyk,
    'gammaS': gammaS,
    'fyd': fyd,
    'fyalphad': fyalphad,
    'Es': Es
  })


  // Geometric declarations (they come in cm, need passing to mm)
  const Lvig = parseFloat(parameters.Lvig) * 10;
  const Bvig = parseFloat(parameters.Bvig) * 10;
  const Hvig = parseFloat(parameters.Hvig) * 10;
  const Svig = parseFloat(parameters.Svig) * 10;
  const Ecc = parseFloat(parameters.Ecc) * 10;
  const b1 = Math.max(Svig * (1 - 1.4 * (Svig/Lvig) ** 2), Svig);
  const A1 = b1 * Ecc;
  const A2 = Bvig * Hvig;
  const I1 = (b1 * Ecc ** 3) / 12;
  const I2 = (Bvig * Hvig ** 3) / 12;
  // Load declarations (they come in kN/m2, need passing to MPa)
  const Pforjado = parseFloat(parameters.Pforjado) / 1000;
  const Pcm = parseFloat(parameters.Pcm) / 1000;
  const Puso = parseFloat(parameters.Puso) / 1000;
  const Pcc = Ecc * (densityC / 1000000);
  const qperm = Pforjado + Pcc + Pcm;
  const qmed = Puso;
  const qratioperm = qperm / (qperm + qmed);
  const qratiomed = qmed / (qperm + qmed);
  
  console.log({
    'Pforjado': Pforjado,
    'Pcm': Pcm,
    'Pcc': Pcc,
    'qperm': qperm,
    'qmed': qmed
  })

  // Safety coefficients
  const gammaG = parseFloat(parameters.gammaG);
  const gammaQ = parseFloat(parameters.gammaQ);
  const gammaV = parseFloat(parameters.gammaV);
  const gammaM = parseFloat(parameters.gammaM);

  // Loads for design
  const Gelu = gammaG * qperm + gammaQ * qmed;
  const Gels = qperm + qmed;
  const Mdv = (Gelu * Svig * Lvig ** 2) / 8;
  const Vdv = (Gelu * Svig * Lvig) / 2;
  
  console.log({
    'Gelu': Gelu,
    'Gels': Gels,
    'Mdv': Mdv,
    'Vdv': Vdv
  })

  // Connectors
  const Dcon = parseFloat(parameters.Dcon);
  const Smax = parseFloat(parameters.Smax);
  const Smin = parseFloat(parameters.Smin);
  const Hcon = parseFloat(parameters.Hcon);
  const Pcon = parseFloat(parameters.Pcon);
  
  // Connector verifications
  const Sef = 0.75 * Smin + 0.25 * Smax;
  const Sratio = Smax / (4 * Smin);

  console.log({
    'Sef': Sef,
    'Sratio': Sratio
  })
  // ELU: Short term loads
  const E2 = woodProps.E0medio * 1000;
  const ft0k = woodProps.ft0k;
  const fmk = woodProps.fmk;

  const Kser = 2 * (woodProps.romedio ** 1.5) * Dcon / 23;
  const Ku = 2* Kser / 3;

  const gammaELU = 1 / (1 + ((Ec * A1 * Sef * Math.PI**2)/(Ku * Lvig ** 2)));
  const a2 = (gammaELU * Ec * A1 * (Ecc + Hvig)) / (2 * (Ec * A1 * gammaELU + E2 * A2));
  const a1 = (Ecc + Hvig - 2 * a2) / 2;
  const EIef = Ec * I1 + 
                gammaELU * Ec * A1 * a1**2 +
                E2 * I2 +
                E2 * A2 * a2**2;
  
  const sigma1 = (gammaELU * Ec * a1 * Mdv) / EIef;
  const sigmam1 = (0.5 * Ec * Ecc * Mdv) / EIef;
  const sigma2 = (E2 * a2 * Mdv) / EIef;
  const sigmam2 = (0.5 * E2 * Hvig * Mdv) / EIef;
  const sigmac1d = sigma1 + sigmam1;
  const sigmat1d = sigmam1 - sigma1

  const compressionRatio = sigmac1d / fcd;
  const tractionRatio = sigmat1d / fctmd;

  console.log({
    'b1': b1,
    'A1': A1,
    'A2': A2,
    'Kser': Kser,
    'Ku': Ku,
    'gammaELU': gammaELU,
    'a2': a2,
    'a1': a1,
    'I1': I1,
    'I2': I2,
    'EIef': EIef,
    'sigma1': sigma1,
    'sigmam1': sigmam1,
    'sigma2': sigma2,
    'sigmam2': sigmam2,
    'compressionRatio': compressionRatio,
    'tractionRatio': tractionRatio
  })


  const kmod1 = kmodsCTE[parameters.ClaseServicio].kmod1;
  const kmodm = kmodsCTE[parameters.ClaseServicio].kmodm;
  const sigmac2d = sigmam2 - sigma2;
  const sigmat2d = sigmam2 + sigma2;
  const kmoddef = qratioperm * kmod1 + qratiomed * kmodm;
  const ft0d = kmoddef * ft0k / gammaM;
  const fmd = kmoddef * fmk / gammaM;
  const sigmat0d = sigma2;
  const sigmamyd = sigmam2;

  const woodFlexoTractionRatio = (sigmat0d / ft0d) + (sigmamyd / fmd);

  console.log({
    'kmod1':kmod1,
    'kmodm':kmodm,
    'sigmac2d':sigmac2d,
    'sigmat2d':sigmat2d,
    'kmoddef':kmoddef,
    'ft0d':ft0d,
    'fmd':fmd,
    'sigmat0d':sigmat0d,
    'sigmamyd':sigmamyd,
    'woodFlexoTractionRatio':woodFlexoTractionRatio
  })
  // Tangent tensions ELU
  const fvk = woodProps.fvk;
  const tau2max = (Vdv * 0.5 * E2 * Bvig * (0.5 * Hvig + a2)**2) / (Bvig * EIef);
  const fvd = kmod1 * fvk / gammaM;

  const woodShearRatio = tau2max / fvd;

  console.log({
    'fvk':fvk,
    'tau2max':tau2max,
    'fvd':fvd,
    'woodShearRatio':woodShearRatio
  })
  // ELU unions
  const Funion = (gammaELU * Ec * A1 * a1 * Sef * Vdv) / EIef;
  const slenderness = Hcon / Dcon;
  let alpha = 1;
  if (3 < slenderness && slenderness < 4){
    alpha = 0.2 * (slenderness + 1)
  }

  const rok = woodProps.rok;
  const Rdh = (0.29 * alpha * Dcon**2) * Math.sqrt(fck * Ec / gammaV);
  const Rdst = 0.8 * fyk * (0.25 * Math.PI * Dcon**2 ) / gammaV;
  const fh0k = 0.082* (1 - 0.01 * Dcon) * rok;
  const k90 = 1.35 + 0.015 * Dcon;
  const boltAngle = (90 * Math.PI) / 180.0;
  const fh90k = fh0k / ((k90 * Math.sin(boltAngle)**2) + Math.cos(boltAngle)**2);
  const fh90d = kmod1 * fh90k / gammaM;
  const Myk = (0.8 * fyk * Dcon**3) / 6;
  const Myd = Myk / gammaS;
  const Rdm1 = 1.1 * fh90d * Pcon * Dcon * ((Math.sqrt(2 + (4 * Myd / (fh90d * Dcon * Pcon**2)))) -1);
  const Rdm2 = 1.5 * Math.sqrt(2 * Myd * fh90d * Dcon);
  const Rd = Math.min(Rdh, Rdst, Rdm1, Rdm2);

  const unionRatio = Funion / Rd;

  console.log({
    'Funion':Funion,
    'slenderness':slenderness,
    'alpha':alpha,
    'rok':rok,
    'Rdh': Rdh,
    'fh0k':fh0k,
    'k90':k90,
    'boltAngle':boltAngle,
    'fh90k':fh90k,
    'fh90d':fh90d,
    'Myk':Myk,
    'Myd': Myd,
    'Rdm1': Rdm1,
    'Rdm2': Rdm2,
    'Rd':Rd,
    'unionRatio': unionRatio
  })

  //ELU mixt section
  const kdefperm = kmodsCTE[parameters.ClaseServicio].kdefperm;
  const kdefmed = kmodsCTE[parameters.ClaseServicio].kdefmed;
  const psi1p = 2.25;
  const psimed = 1.35;

  const Eef1 = Ec * (qratioperm / (1 + psi1p) + (qratiomed / (1 + psimed)));
  const Eef2 = E2 * (qratioperm / (1 + kdefperm) + (qratiomed / (1 + kdefmed)));
  const kdef = qratioperm * kdefperm + qratiomed * kdefmed;
  const Kufin = Ku / (1 + kdef);
  const K1 = Kufin;
  
  const gammaELUMixt = 1 / (1 + ((Eef1* A1 * Sef * Math.PI**2)/(K1 * Lvig ** 2)));
  const a2Mixt = (gammaELUMixt * Eef1 * A1 * (Ecc + Hvig)) / (2 * (Eef1 * A1 * gammaELUMixt + Eef2 * A2));
  const a1Mixt = 0.5 * (Ecc + Hvig) - a2Mixt;
  const EIefMixt = Eef1 * I1 + 
                   gammaELUMixt * Eef1 * A1 * a1Mixt**2 + 
                   Eef2 * I2 + 
                   Eef2 * A2 * a2Mixt**2;
  const sigma1Mixt = (gammaELUMixt * Eef1 * a1Mixt * Mdv) / EIefMixt;
  const sigmam1Mixt = (0.5 * Eef1 * Ecc * Mdv) / EIefMixt;
  const sigma2Mixt = (Eef2 * a2Mixt * Mdv) / EIefMixt;
  const sigmam2Mixt = (0.5 * Eef2 * Hvig * Mdv) / EIefMixt;
  const sigmac1dMixt = sigma1Mixt + sigmam1Mixt
  const sigmat1dMixt = sigmam1Mixt - sigma1Mixt;

  const compressionRatioMixt = sigmac1dMixt / fcd;
  const tractionRatioMixt = sigmat1dMixt / fctmd; 
  const woodFlexoTractionRatioLongDuration = (sigma2Mixt / ft0d) + (sigmam2Mixt / fmd);

  console.log({
    'kdefperm': kdefperm,
    'kdefmed': kdefmed,
    'psi1p': psi1p,
    'psimed': psimed,
    'Eef1': Eef1,
    'Eef2': Eef2,
    'kdef': kdef,
    'Kufin': Kufin,
    'K1': K1,
    'gammaELUMixt': gammaELUMixt,
    'a1Mixt': a1Mixt,
    'a2Mixt': a2Mixt,
    'EIefMixt': EIefMixt,
    'sigma1Mixt': sigma1Mixt,
    'sigmam1Mixt': sigmam1Mixt,
    'sigma2Mixt': sigma2Mixt,
    'sigmam2Mixt': sigmam2Mixt,
    'sigmac1dMixt': sigmac1dMixt,
    'sigmat1dMixt': sigmat1dMixt,
    'compressionRatioMixt': compressionRatioMixt,
    'tractionRatioMixt': tractionRatioMixt,
    'woodFlexoTractionRatioLongDuration': woodFlexoTractionRatioLongDuration
  })

  // ELU shear final
  const tau2maxFinal =  (Vdv * 0.5 * Eef2 * Bvig * (0.5 * Hvig + a2Mixt)**2) / (Bvig * EIefMixt);
  const fvdFinal = kmoddef * fvk / gammaM;

  const shearRatioFinal = tau2maxFinal / fvdFinal;

  console.log({
    'tau2maxFinal': tau2maxFinal,
    'fvdFinal': fvdFinal,
    'shearRatioFinal': shearRatioFinal
  })

  // ELU union final
  const FunionFinal = (gammaELUMixt * Eef1 * A1 * a1Mixt * Sef * Vdv) / EIefMixt;
  
  const unionRatioFinal = FunionFinal / Rd;

  console.log({
    'gammaELUMixt': gammaELUMixt,
    'Eef1': Eef1,
    'A1':A1,
    'a1Mixt': a1Mixt,
    'Sef': Sef,
    'Vdv': Vdv,
    'EIefMixt': EIefMixt,
    'Rd': Rd,
    'FunionFinal': FunionFinal,
    'unionRatioFinal': unionRatioFinal
  })
  // ELS 
  const gammaELS = 1 / (1 + ((Ec * A1 * Sef * Math.PI**2)/(Kser * Lvig ** 2)));
  const a2Ser =  (gammaELS * Ec * A1 * (Ecc + Hvig)) / (2 * (Ec * A1 * gammaELS + E2 * A2));
  const a1Ser = 0.5 * (Ecc + Hvig) - a2Ser;
  const EIefSer = Ec * I1 + 
                  gammaELS * Ec * A1 * a1Ser**2 + 
                  E2 * I2 + 
                  E2 * A2 * a2Ser**2;
  const fpermelas = (5 * qperm * Svig * Lvig**4) / (384 * EIefSer);
  const fmedelas = (5 * qmed * Svig * Lvig**4) / (384 * EIefSer);
  const felas = fpermelas + fmedelas;
  
  
  const E1fluperm = Ec / (1 + psi1p);
  const E2fluperm = E2 / (1 + kdefperm);
  const gammaELSfluperm = 1 / (1 + ((E1fluperm * A1 * Sef * Math.PI**2)/(Kser * Lvig ** 2)));
  const a2fluperm =  (gammaELSfluperm * E1fluperm * A1 * (Ecc + Hvig)) / (2 * (E1fluperm * A1 * gammaELSfluperm + E2fluperm * A2));
  const a1fluperm = 0.5 * (Ecc + Hvig) - a2fluperm;
  const EIeffluperm = E1fluperm * I1 + 
                      gammaELSfluperm * E1fluperm * A1 * a1fluperm**2 + 
                      E2fluperm * I2 + 
                      E2fluperm * A2 * a2fluperm**2;
  const fpermflu = (5 * qperm * Svig * Lvig**4) / (384 * EIeffluperm);

  const E1flumed = Ec / (1 + psimed);
  const E2flumed = E2 / (1 + kdefmed);
  const gammaELSflumed = 1 / (1 + ((E1flumed * A1 * Sef * Math.PI**2)/(Kser * Lvig ** 2)));
  const a2flumed =  (gammaELSflumed * E1flumed * A1 * (Ecc + Hvig)) / (2 * (E1flumed * A1 * gammaELSflumed + E2flumed* A2));
  const a1flumed = 0.5 * (Ecc + Hvig) - a2flumed;
  const EIefflumed = E1flumed * I1 + 
                      gammaELSflumed * E1flumed * A1 * a1flumed**2 + 
                      E2flumed * I2 + 
                      E2flumed * A2 * a2flumed**2;
  const fmedflu = (5 * qmed * Svig * Lvig**4) / (384 * EIefflumed);

  const ftotalflu = fpermflu + fmedflu;
  
  const fratio = Lvig / ftotalflu;

  console.log({
    'gammaELS': gammaELS,
    'a2Ser': a2Ser,
    'a1Ser': a1Ser,
    'EIefSer': EIefSer,
    'fpermelas': fpermelas,
    'fmedelas': fmedelas,
    'felas': felas,
    'E1fluperm': E1fluperm,
    'E2fluperm': E2fluperm,
    'gammaELSfluperm': gammaELSfluperm,
    'a2fluperm': a2fluperm,
    'EIeffluperm': EIeffluperm,
    'fpermflu': fpermflu,
    'E1flumed': E1flumed,
    'E2flumed': E2flumed,
    'gammaELSflumed': gammaELSflumed,
    'a2flumed': a2flumed,
    'a1flumed': a1flumed,
    'EIefflumed': EIefflumed,
    'fmedflu': fmedflu,
    'ftotalflu': ftotalflu,
    'fratio': fratio
  })

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ fcd: {fcd}, woodClass: {woodClass}, woodProps: {woodProps}, kmods:{kmods}}),
  })
}
