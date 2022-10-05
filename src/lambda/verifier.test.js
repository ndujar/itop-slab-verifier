import * as verifier from './verify'

const parameters = {
    fck: 30,
    fyk: 500,
    ClaseMadera: "C20",
    ClaseServicio: "1",
    Ecc: 6,
    Lvig: 515,
    Bvig: 15,
    Hvig: 20,
    Svig: 65,
    Dcon: 12,
    Smin: 50,
    Smax: 100,
    Hcon: 50,
    Pcon: 100,
    Pangle: 90,
    Pforjado: 1.5,
    Pcm: 1.5,
    Puso: 2,
    gammaG: 1.35,
    gammaQ: 1.5,
    gammaV: 1.25,
    gammaC: 1.5,
    gammaM: 1.3,
    gammaS: 1.25,
    gammaSp: 1.1

  }

  const coefficients = {
    gammaG: 1.35,
    gammaQ: 1.5,
    gammaV: 1.25,
    gammaC: 1.5,
    gammaM: 1.3,
    gammaS: 1.25,
    gammaSp: 1.1
  }

  const geometry = {
    Lvig: 5150,
    Bvig: 150,
    Hvig: 200,
    Svig: 650,
    Ecc: 60,
    b1: 650,
    A1: 39000,
    A2: 30000,
    I1: 11700000,
    I2: 100000000
  }

  const connectorProperties = {
    fyk: 500,
    fyd: 400,
    fyalphad: 400,
    Dcon: 12,
    Smax: 100,
    Smin: 50,
    Hcon: 50,
    Pcon: 100,
    Pangle: 90,
    Sef: 62.5,
    Sratio: 0.5
  }

  const woodProperties = {
    kmods: {
        kmodp: 0.6,
        kmod1: 0.7,
        kmodm: 0.8,
        kmodc: 0.9,
        kmoddef: 0.7307692307692307,
        kmodi: 1.1,
        kdefperm: 0.6,
        kdefmed: 0.25
      },
      E2: 9500,
      ft0k: 12,
      fmk: 20,
      fvk: 3.6,
      ft0d: 6.745562130177514,
      fmd: 11.242603550295858,
      Kser: 8036.747360004818,
      Ku: 5357.831573336545,
      rok: 330

  }

  const concreteProperties = {
    fck: 30,
    fctmd: 1.9309787692112594,
    fctfl: 3.5723107230408297,
    f1cd: 12,
    fcd: 20,
    Ec: 28576.790957791185,
    Es: 200000,
    densityC: 25,
    psi1p: 2.25,
    psimed: 1.35

  }

  const appliedLoads = {
    qmed: 0.002,
    qperm: 0.0045000000000000005,
    qratiomed: 0.30769230769230765,
    qratioperm: 0.6923076923076923,
    Gels: 0.006500000000000001,
    Gelu: 0.009075000000000001,
    Mdv: 19556199.609375004,
    Vdv: 15189.281250000002
  }


  const ShortTermBendingULSRatios = {
    compressionRatio: 0.376473136561152,
    tensionRatio: 1.4994540857167618,
    woodFlexoTractionRatio: 0.9602984335303256
  }

  const LongTermBendingULSRatios = {
    compressionRatio: 0.26573583126879674,
    tensionRatio: 0.31776463745828604,
    woodFlexoTractionRatio: 1.0296297875842861
}

test('Safety coefficients should be those from the input:', () => {
    expect(verifier.getSafetyCoefficients(parameters)).toStrictEqual(coefficients);
});

test('Geometry meta parameters should be properly computed:', () => {
    expect(verifier.getGeometry(parameters)).toStrictEqual(geometry);
});

test('Connector parameters should be properly computed:', () => {
    expect(verifier.getConnectorProperties(parameters, coefficients.gammaS)).toStrictEqual(connectorProperties);
});

test('Wood parameters should be properly computed:', () => {
    expect(verifier.getWoodProperties(parameters, appliedLoads, coefficients.gammaM, connectorProperties.Dcon)).toStrictEqual(woodProperties);
});

test('Concrete parameters should be properly computed:', () => {
    expect(verifier.getConcreteProperties(parameters, coefficients.gammaC)).toStrictEqual(concreteProperties);
});

test('Applied loads should be properly computed:', () => {
    expect(verifier.getLoads(parameters, 
        coefficients.gammaG, 
        coefficients.gammaQ, 
        concreteProperties.densityC,
        geometry.Ecc,
        geometry.Svig,
        geometry.Lvig
        )).toStrictEqual(appliedLoads);
});

test('Short term bending ULS should be properly computed:', () => {

    const sectionCorrectors = verifier.computeSectionCorrectors( 
                                                        connectorProperties, 
                                                        geometry, 
                                                        concreteProperties.Ec, 
                                                        woodProperties.E2,
                                                        woodProperties.Ku);
                                                          
    expect(verifier.computeBendingULS(concreteProperties, 
                                    woodProperties,
                                    geometry, 
                                    sectionCorrectors,
                                    appliedLoads,
                                    concreteProperties.Ec,
                                    woodProperties.E2
                                    )).toStrictEqual(ShortTermBendingULSRatios);
});

test('Short term shear ULS should be properly computed:', () => {
 
  woodProperties.fvk = 2.2

  const sectionCorrectors = verifier.computeSectionCorrectors(
                                                      connectorProperties, 
                                                      geometry, 
                                                      concreteProperties.Ec, 
                                                      woodProperties.E2,
                                                      woodProperties.Ku);
          
  expect(verifier.computeShearULS(coefficients, 
                                  woodProperties,
                                  geometry, 
                                  sectionCorrectors,
                                  appliedLoads,
                                  woodProperties.E2,
                                  woodProperties.kmods.kmod1
                                  )).toStrictEqual(0.43834106124476013);
});

test('Short term union ULS should be properly computed:', () => {

  const sectionCorrectors = verifier.computeSectionCorrectors(
                                                        connectorProperties, 
                                                        geometry, 
                                                        concreteProperties.Ec, 
                                                        woodProperties.E2,
                                                        woodProperties.Ku);
                                                    
  expect(verifier.computeUnionsULS(coefficients,
                                  concreteProperties, 
                                  woodProperties,
                                  connectorProperties,
                                  geometry, 
                                  sectionCorrectors,
                                  appliedLoads,
                                  concreteProperties.Ec
                                  )).toStrictEqual(0.7150876125171662);
});

test('Long term bending ULS should be properly computed:', () => {

  const Eef1 = concreteProperties.Ec * (appliedLoads.qratioperm / (1 + concreteProperties.psi1p) + (appliedLoads.qratiomed / (1 + concreteProperties.psimed)));
  const Eef2 = woodProperties.E2 * (appliedLoads.qratioperm / (1 + woodProperties.kmods.kdefperm) + (appliedLoads.qratiomed / (1 + woodProperties.kmods.kdefmed)));
  const kdef = appliedLoads.qratioperm * woodProperties.kmods.kdefperm + appliedLoads.qratiomed * woodProperties.kmods.kdefmed;
  const Kufin = woodProperties.Ku / (1 + kdef);
  const K1 = Kufin;  

  const sectionCorrectors = verifier.computeSectionCorrectors(
                                                        connectorProperties, 
                                                        geometry, 
                                                        Eef1, 
                                                        Eef2,
                                                        K1);
                                           
  expect(verifier.computeBendingULS(concreteProperties, 
                                    woodProperties,
                                    geometry, 
                                    sectionCorrectors,
                                    appliedLoads,
                                    Eef1,
                                    Eef2
                                    )).toStrictEqual(LongTermBendingULSRatios);
});

test('Long term shear ULS should be properly computed:', () => {
 
  const woodProperties = {
    kmods: {
        kmodp: 0.6,
        kmod1: 0.7,
        kmodm: 0.8,
        kmodc: 0.9,
        kmoddef: 0.7307692307692307,
        kmodi: 1.1,
        kdefperm: 0.6,
        kdefmed: 0.25
      },
      E2: 9500,
      ft0k: 12,
      fmk: 20,
      fvk: 2.2,
      ft0d: 6.745562130177514,
      fmd: 11.242603550295858,
      Kser: 8036.747360004818,
      Ku: 5357.831573336545

  }

  const Eef1 = concreteProperties.Ec * (appliedLoads.qratioperm / (1 + concreteProperties.psi1p) + (appliedLoads.qratiomed / (1 + concreteProperties.psimed)));
  const Eef2 = woodProperties.E2 * (appliedLoads.qratioperm / (1 + woodProperties.kmods.kdefperm) + (appliedLoads.qratiomed / (1 + woodProperties.kmods.kdefmed)));
  const kdef = appliedLoads.qratioperm * woodProperties.kmods.kdefperm + appliedLoads.qratiomed * woodProperties.kmods.kdefmed;
  const Kufin = woodProperties.Ku / (1 + kdef);

  const sectionCorrectors = verifier.computeSectionCorrectors(
                                                      connectorProperties, 
                                                      geometry, 
                                                      Eef1, 
                                                      Eef2,
                                                      Kufin);
          
  expect(verifier.computeShearULS(coefficients, 
                                  woodProperties,
                                  geometry, 
                                  sectionCorrectors,
                                  appliedLoads,
                                  Eef2,
                                  woodProperties.kmods.kmoddef
                                  )).toStrictEqual(0.4407214879282326);
});

test('Long term union ULS should be properly computed:', () => {

  const woodProperties = {
    kmods: {
        kmodp: 0.6,
        kmod1: 0.7,
        kmodm: 0.8,
        kmodc: 0.9,
        kmoddef: 0.7307692307692307,
        kmodi: 1.1,
        kdefperm: 0.6,
        kdefmed: 0.25
      },
      E2: 9500,
      ft0k: 12,
      fmk: 20,
      fvk: 2.2,
      ft0d: 6.745562130177514,
      fmd: 11.242603550295858,
      Kser: 8036.747360004818,
      Ku: 5357.831573336545,
      rok: 330

  }

  const Eef1 = concreteProperties.Ec * (appliedLoads.qratioperm / (1 + concreteProperties.psi1p) + (appliedLoads.qratiomed / (1 + concreteProperties.psimed)));
  const Eef2 = woodProperties.E2 * (appliedLoads.qratioperm / (1 + woodProperties.kmods.kdefperm) + (appliedLoads.qratiomed / (1 + woodProperties.kmods.kdefmed)));
  const kdef = appliedLoads.qratioperm * woodProperties.kmods.kdefperm + appliedLoads.qratiomed * woodProperties.kmods.kdefmed;
  const Kufin = woodProperties.Ku / (1 + kdef);

  const sectionCorrectors = verifier.computeSectionCorrectors(
                                                      connectorProperties, 
                                                      geometry, 
                                                      Eef1, 
                                                      Eef2,
                                                      Kufin);
          
                                                      
  expect(verifier.computeUnionsULS(coefficients,
                                  concreteProperties, 
                                  woodProperties,
                                  connectorProperties,
                                  geometry, 
                                  sectionCorrectors,
                                  appliedLoads,
                                  Eef1
                                  )).toStrictEqual(0.7254374679977972);
});

test('Long term deflection SLS should be properly computed:', () => {

  const woodProperties = {
    kmods: {
        kmodp: 0.6,
        kmod1: 0.7,
        kmodm: 0.8,
        kmodc: 0.9,
        kmoddef: 0.7307692307692307,
        kmodi: 1.1,
        kdefperm: 0.6,
        kdefmed: 0.25
      },
      E2: 9500,
      ft0k: 12,
      fmk: 20,
      fvk: 2.2,
      ft0d: 6.745562130177514,
      fmd: 11.242603550295858,
      Kser: 8036.747360004818,
      Ku: 5357.831573336545,
      rok: 330

  }


  const sectionCorrectors = verifier.computeSectionCorrectors(
                                                      connectorProperties, 
                                                      geometry, 
                                                      concreteProperties.Ec, 
                                                      woodProperties.E2,
                                                      woodProperties.Kser);

  expect(verifier.computeDeflectionSLS(
                                  concreteProperties, 
                                  woodProperties,
                                  connectorProperties,
                                  geometry, 
                                  sectionCorrectors,
                                  appliedLoads
                                  )).toStrictEqual(308.0394661956837);
});

test('Handler function should run from start to end', () => {
  
  // Collect needed data into concrete, connectors, geometry, loads and wood objects
  const coefficients = verifier.getSafetyCoefficients(parameters);
  const concrete = verifier.getConcreteProperties(parameters, coefficients.gammaC);
  const connectors = verifier.getConnectorProperties(parameters, coefficients.gammaS);
  const geometry = verifier.getGeometry(parameters);
  const loads = verifier.getLoads(parameters, 
                                  coefficients.gammaG, 
                                  coefficients.gammaQ, 
                                  concrete.densityC,
                                  geometry.Ecc,
                                  geometry.Svig,
                                  geometry.Lvig
                                  );
  const wood = verifier.getWoodProperties(parameters, 
                                  loads, 
                                  coefficients.gammaM, 
                                  connectors.Dcon);

  // Get short terms effect of forces applied
  let sectionCorrectors = verifier.computeSectionCorrectors(connectors, 
                                                            geometry, 
                                                            concrete.Ec, 
                                                            wood.E2, 
                                                            wood.Ku);

  const shortTermBending = verifier.computeBendingULS(concrete, 
                                                      wood,
                                                      geometry, 
                                                      sectionCorrectors,
                                                      loads,
                                                      concrete.Ec,
                                                      wood.E2
                                                      );
                

  const shortTermShear = verifier.computeShearULS(coefficients,
                                                  wood,
                                                  geometry,
                                                  sectionCorrectors,
                                                  loads,
                                                  wood.E2,
                                                  wood.kmods.kmoddef
                                                  );
  
  const shortTermUnions = verifier.computeUnionsULS(coefficients,
                                                    concrete, 
                                                    wood,
                                                    connectors,
                                                    geometry, 
                                                    sectionCorrectors,
                                                    loads,
                                                    concrete.Ec
                                                    )
  // Get long term effects of forces applied
  const Eef1 = concrete.Ec * (loads.qratioperm / (1 + concrete.psi1p) + (loads.qratiomed / (1 + concrete.psimed)));
  const Eef2 = wood.E2 * (loads.qratioperm / (1 + wood.kmods.kdefperm) + (loads.qratiomed / (1 + wood.kmods.kdefmed)));
  const kdef = loads.qratioperm * wood.kmods.kdefperm + loads.qratiomed * wood.kmods.kdefmed;
  const Kufin = wood.Ku / (1 + kdef);

  sectionCorrectors = verifier.computeSectionCorrectors(connectors, 
                                                        geometry, 
                                                        Eef1, 
                                                        Eef2, 
                                                        Kufin);

  const longTermBending = verifier.computeBendingULS(concrete, 
                                                      wood,
                                                      geometry, 
                                                      sectionCorrectors,
                                                      loads,
                                                      Eef1,
                                                      Eef2
                                                      );
                

  const longTermShear = verifier.computeShearULS(coefficients,
                                                  wood,
                                                  geometry,
                                                  sectionCorrectors,
                                                  loads,
                                                  Eef2,
                                                  wood.kmods.kmoddef
                                                  );


  const longTermUnions = verifier.computeUnionsULS(coefficients,
                                                    concrete, 
                                                    wood,
                                                    connectors,
                                                    geometry, 
                                                    sectionCorrectors,
                                                    loads,
                                                    Eef1
                                                    )

  sectionCorrectors = verifier.computeSectionCorrectors(connectors, 
                                                        geometry, 
                                                        concrete.Ec, 
                                                        wood.E2, 
                                                        wood.Kser);    

  const deflection = verifier.computeDeflectionSLS(concrete, 
                                                    wood,
                                                    connectors,
                                                    geometry, 
                                                    sectionCorrectors,
                                                    loads
                                                    )

  const verifications = {shortTermBending: shortTermBending, 
                          shortTermShear: shortTermShear,
                          shortTermUnions: shortTermUnions,
                          longTermBending: longTermBending, 
                          longTermShear: longTermShear,
                          longTermUnions: longTermUnions,
                          deflection: deflection
                        }   
  expect(verifications).toStrictEqual({"deflection": 308.0394661956837, "longTermBending": {"compressionRatio": 0.26573583126879674, "tensionRatio": 0.31776463745828604, "woodFlexoTractionRatio": 1.0296297875842861}, "longTermShear": 0.2693297981783644, "longTermUnions": 0.7254374679977972, "shortTermBending": {"compressionRatio": 0.376473136561152, "tensionRatio": 1.4994540857167618, "woodFlexoTractionRatio": 0.9602984335303256}, "shortTermShear": 0.2565961416994181, "shortTermUnions": 0.7150876125171662}
  );                                         
})