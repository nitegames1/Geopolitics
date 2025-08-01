// @ts-nocheck


// ==== PERSISTENT WORLD ENGINE ====
class WorldEngine {
  state;
  history;
  divergencePoints;
  butterflyEffects;
  constructor(initialState) {
    this.state = initialState;
    this.history = [];
    this.divergencePoints = [];
    // Track subtle historical ripples caused by player choices
    this.butterflyEffects = new Map();
  }

  // Track how decisions cascade through time
  recordDecision(decision, turn) {
    const effects = this.calculateCascadingEffects(decision);
    this.history.push({ turn, decision, effects, timestamp: Date.now() });
    
    // Check for major divergence
    if (effects.divergenceScore > 50) {
      this.divergencePoints.push({
        turn,
        decision: decision.title,
        historicalPath: decision.historicalOutcome,
        actualPath: decision.id,
        consequences: effects.majorConsequences
      });
    }
  }

  calculateCascadingEffects(decision) {
    const effects = {
      immediate: {},
      shortTerm: {}, // 1-6 months
      mediumTerm: {}, // 6-24 months
      longTerm: {}, // 2+ years
      divergenceScore: 0,
      majorConsequences: []
    };

    // Complex calculation based on decision type and current world state
    if (decision.category === 'foreign' && decision.id === 'military_intervention') {
      effects.divergenceScore = 85;
      effects.majorConsequences.push('Early American militarization');
      effects.longTerm.militaryIndustrialComplex = true;
      effects.longTerm.isolationismDead = true;
    }

    return effects;
  }

  simulateOtherNations(playerState) {
    const nationActions = {};
    
    // Each nation has its own goals and decision-making
    Object.entries(playerState.nations).forEach(([nation, data]) => {
      const ai = new NationAI(nation, data, playerState);
      nationActions[nation] = ai.decideTurn();
    });

    return nationActions;
  }
}

// ==== NATION AI SYSTEM ====
class NationAI {
  nation;
  data;
  worldState;
  personality;
  constructor(nation, data, worldState) {
    this.nation = nation;
    this.data = data;
    this.worldState = worldState;
    this.personality = this.getNationPersonality(nation);
  }

  getNationPersonality(nation) {
    const personalities = {
      germany: { aggression: 85, opportunism: 90, rationality: 60, ideology: 95 },
      britain: { aggression: 30, opportunism: 50, rationality: 80, ideology: 40 },
      france: { aggression: 25, opportunism: 40, rationality: 70, ideology: 35 },
      japan: { aggression: 80, opportunism: 85, rationality: 65, ideology: 85 },
      sovietUnion: { aggression: 70, opportunism: 75, rationality: 75, ideology: 90 },
      italy: { aggression: 65, opportunism: 80, rationality: 50, ideology: 70 }
    };
    return personalities[nation] || { aggression: 50, opportunism: 50, rationality: 50, ideology: 50 };
  }

  decideTurn() {
    const decisions = [];
    
    // Evaluate strategic situation
    const threats = this.evaluateThreats();
    const opportunities = this.evaluateOpportunities();
    const constraints = this.evaluateConstraints();
    
    // Make decisions based on personality and situation
    if (threats.length > 0 && this.personality.rationality > 60) {
      decisions.push(this.respondToThreats(threats));
    }
    
    if (opportunities.length > 0 && this.personality.opportunism > 70) {
      decisions.push(this.exploitOpportunities(opportunities));
    }
    
    // Internal politics
    if (this.data.internalStability < 50) {
      decisions.push(this.handleInternalCrisis());
    }
    
    return decisions.filter(d => d !== null);
  }

  evaluateThreats() {
    const threats = [];
    
    // Military threats
    Object.entries(this.worldState.nations).forEach(([other, data]) => {
      if (other !== this.nation) {
        const relationshipValue = this.worldState.relationships?.[this.nation]?.[other]?.value || 50;
        const militaryBalance = data.military.totalStrength / this.data.military.totalStrength;
        
        if (relationshipValue < 30 && militaryBalance > 1.2) {
          threats.push({
            type: 'military',
            source: other,
            severity: (100 - relationshipValue) * militaryBalance
          });
        }
      }
    });
    
    // Economic threats
    if (this.data.economy.gdpGrowth < -2) {
      threats.push({
        type: 'economic',
        source: 'internal',
        severity: Math.abs(this.data.economy.gdpGrowth) * 10
      });
    }
    
    return threats;
  }

  evaluateOpportunities() {
    const opportunities = [];
    
    // Expansion opportunities
    if (this.personality.aggression > 70) {
      const weakNeighbors = this.findWeakNeighbors();
      weakNeighbors.forEach(neighbor => {
        opportunities.push({
          type: 'expansion',
          target: neighbor.name,
          successProbability: this.calculateSuccessProbability(neighbor)
        });
      });
    }
    
    // Alliance opportunities
    const potentialAllies = this.findPotentialAllies();
    potentialAllies.forEach(ally => {
      opportunities.push({
        type: 'alliance',
        target: ally.name,
        mutualBenefit: this.calculateMutualBenefit(ally)
      });
    });
    
    return opportunities;
  }

  evaluateConstraints() {
    return {
      economic: this.data.economy.treasury < 20,
      military: this.data.military.readiness < 40,
      political: this.data.internalStability < 60,
      diplomatic: this.countHostileNeighbors() > 2
    };
  }

  findWeakNeighbors() {
    return Object.entries(this.worldState.nations)
      .filter(([name, data]) => {
        const isNeighbor = this.worldState.geography[this.nation]?.neighbors?.includes(name);
        const isWeak = data.military.totalStrength < this.data.military.totalStrength * 0.5;
        return isNeighbor && isWeak;
      })
      .map(([name, data]) => ({ name, data }));
  }

  respondToThreats(threats) {
    const mostSevere = threats.sort((a, b) => b.severity - a.severity)[0];
    
    if (mostSevere.type === 'military') {
      return {
        type: 'military_preparation',
        action: 'mobilize',
        target: mostSevere.source,
        intensity: Math.min(100, mostSevere.severity)
      };
    }
    
    return null;
  }

  exploitOpportunities(opportunities) {
    const best = opportunities.sort((a, b) => 
      (b.successProbability || b.mutualBenefit) - (a.successProbability || a.mutualBenefit)
    )[0];
    
    if (best && best.type === 'expansion' && best.successProbability > 70) {
      return {
        type: 'aggressive_action',
        action: 'pressure',
        target: best.target,
        intensity: this.personality.aggression
      };
    }
    
    return null;
  }

  findPotentialAllies() {
    const relations = this.worldState.relationships[this.nation] ||
      this.worldState.relationships.usa || {};

    return Object.entries(relations)
      .filter(([name, rel]) => name !== this.nation && rel.value > 60)
      .map(([name]) => ({ name, data: this.worldState.nations[name] }));
  }

  calculateMutualBenefit(ally) {
    const relation = (this.worldState.relationships[this.nation] || {})[ally.name] ||
      (this.worldState.relationships[ally.name] || {})[this.nation] ||
      { value: 50 };
    const economyScore =
      ((this.data.economy.gdp || 0) + (ally.data?.economy?.gdp || 0)) / 20;
    return Math.min(100, (relation.value + economyScore) / 2);
  }

  calculateSuccessProbability(target) {
    const relation = (this.worldState.relationships[this.nation] || {})[target.name] ||
      { value: 50 };
    const balance = this.data.military.totalStrength /
      (target.data?.military?.totalStrength || 1);
    let score = 50 + (balance - 1) * 20 - (relation.value - 50) * 0.5;
    return Math.max(5, Math.min(95, score));
  }

  countHostileNeighbors() {
    const relations = this.worldState.relationships[this.nation] ||
      this.worldState.relationships.usa || {};
    return Object.values(relations).filter(rel => rel.value < 40).length;
  }

  handleInternalCrisis() {
    return {
      type: 'internal_action',
      action: 'stabilize',
      method: this.personality.ideology > 70 ? 'purge' : 'reform'
    };
  }
}

// ==== ENHANCED MAIN COMPONENT ====
const AdvancedGeopoliticalSimulation = () => {
  // Initialize with much deeper state
  const [gameState, setGameState] = useState({
    // Core Timeline
    year: 1936,
    month: 1,
    turn: 1,
    
    turnEvents: [],
    // Enhanced National Stats
    player: {
      nation: 'usa',
      leader: 'Franklin D. Roosevelt',
      government: 'democratic',
      legitimacy: 85,
      
      economy: {
        gdp: 1000,
        gdpGrowth: -2.5,
        unemployment: 17,
        inflation: -1.2,
        treasury: 45,
        debt: 42,
        
        sectors: {
          agriculture: { size: 25, growth: -5, employment: 8500000 },
          manufacturing: { size: 35, growth: -3, employment: 9200000 },
          services: { size: 40, growth: 1, employment: 12300000 }
        },
        
        trade: {
          exports: 120,
          imports: 95,
          mainPartners: ['britain', 'france', 'canada', 'mexico'],
          tariffs: 35
        }
      },
      
      military: {
        totalStrength: 45,
        readiness: 60,
        
        army: {
          personnel: 180000,
          divisions: 12,
          equipment: 40,
          doctrine: 'defensive'
        },
        
        navy: {
          personnel: 120000,
          capitalShips: 15,
          carriers: 3,
          submarines: 55,
          doctrine: 'two_ocean'
        },
        
        airforce: {
          personnel: 20000,
          fighters: 800,
          bombers: 400,
          doctrine: 'strategic_bombing'
        },
        
        technology: {
          level: 65,
          research: ['radar', 'improved_engines', 'cryptography'],
          breakthrough_chance: 15
        }
      },
      
      politics: {
        publicSupport: 72,
        congressSupport: 68,
        
        parties: {
          democrats: { seats: 310, unity: 75, mood: 'confident' },
          republicans: { seats: 125, unity: 80, mood: 'opposition' }
        },
        
        factions: {
          isolationists: { 
            strength: 75, 
            leader: 'Charles Lindbergh', 
            mood: 'aggressive',
            goals: ['avoid_war', 'america_first', 'reduce_spending'],
            recent_actions: []
          },
          interventionists: {
            strength: 25,
            leader: 'William Allen White',
            mood: 'concerned',
            goals: ['support_allies', 'military_buildup', 'collective_security'],
            recent_actions: []
          },
          progressives: {
            strength: 65,
            leader: 'Harold Ickes',
            mood: 'hopeful',
            goals: ['expand_new_deal', 'social_reform', 'labor_rights'],
            recent_actions: []
          },
          business: {
            strength: 45,
            leader: 'Chamber of Commerce',
            mood: 'worried',
            goals: ['reduce_regulation', 'lower_taxes', 'free_enterprise'],
            recent_actions: []
          }
        }
      },
      
      society: {
        population: 128000000,
        urbanization: 56,
        literacy: 94,
        
        demographics: {
          age_distribution: { youth: 35, working: 55, elderly: 10 },
          regional_distribution: {
            northeast: { population: 35000000, growth: 0.5 },
            south: { population: 37000000, growth: 0.8 },
            midwest: { population: 34000000, growth: 0.3 },
            west: { population: 22000000, growth: 2.1 }
          }
        },
        
        social_issues: {
          civil_rights: { tension: 65, trending: 'rising' },
          labor_relations: { tension: 75, trending: 'volatile' },
          immigration: { tension: 45, trending: 'stable' }
        }
      }
    },
    
    // Other Nations with Deep Simulation
    nations: {
      germany: {
        leader: 'Adolf Hitler',
        government: 'fascist',
        legitimacy: 80,
        
        economy: {
          gdp: 450,
          gdpGrowth: 8.5,
          unemployment: 4,
          militarySpending: 35,
          autarky: 65
        },
        
        military: {
          totalStrength: 65,
          readiness: 75,
          expansion_plans: ['rhineland', 'austria', 'czechoslovakia'],
          secret_programs: ['luftwaffe', 'panzer', 'uboat']
        },
        
        internal: {
          naziPartyControl: 85,
          oppositionStrength: 10,
          propagandaEffectiveness: 90,
          goals: ['lebensraum', 'overturn_versailles', 'racial_state']
        }
      },
      
      britain: {
        leader: 'Stanley Baldwin',
        government: 'conservative',
        legitimacy: 75,
        
        economy: {
          gdp: 520,
          gdpGrowth: 2.1,
          unemployment: 11,
          empire_contribution: 35,
          financial_center: true
        },
        
        military: {
          totalStrength: 55,
          readiness: 45,
          naval_supremacy: 85,
          empire_forces: 25
        },
        
        internal: {
          appeasement_support: 70,
          rearmament_support: 30,
          empire_stability: 65,
          goals: ['preserve_empire', 'avoid_war', 'economic_recovery']
        }
      },
      
      france: {
        leader: 'Léon Blum',
        government: 'popular_front',
        legitimacy: 60,
        
        economy: {
          gdp: 280,
          gdpGrowth: -0.5,
          unemployment: 15,
          social_spending: 45,
          political_instability: 70
        },
        
        military: {
          totalStrength: 50,
          readiness: 60,
          maginot_line: 80,
          colonial_forces: 30
        },
        
        internal: {
          political_divisions: 85,
          communist_influence: 35,
          fascist_threat: 25,
          goals: ['security_guarantee', 'social_reform', 'contain_germany']
        }
      },
      
      japan: {
        leader: 'Emperor Hirohito',
        government: 'military_dominated',
        legitimacy: 90,
        
        economy: {
          gdp: 220,
          gdpGrowth: 5.2,
          unemployment: 6,
          resource_dependence: 85,
          zaibatsu_power: 75
        },
        
        military: {
          totalStrength: 70,
          readiness: 80,
          naval_buildup: 85,
          china_operations: 65
        },
        
        internal: {
          military_faction_power: 80,
          civilian_government_power: 20,
          emperor_influence: 'ceremonial',
          goals: ['greater_east_asia', 'resource_independence', 'rival_west']
        }
      },
      
      sovietUnion: {
        leader: 'Joseph Stalin',
        government: 'communist',
        legitimacy: 70,
        
        economy: {
          gdp: 380,
          gdpGrowth: 12.5,
          unemployment: 0, // Official figure
          industrialization: 55,
          collectivization: 75
        },
        
        military: {
          totalStrength: 60,
          readiness: 40, // Pre-purge
          modernization: 45,
          officer_purge_impact: -30
        },
        
        internal: {
          party_control: 90,
          purge_intensity: 85,
          paranoia_level: 95,
          goals: ['survive_capitalism', 'industrialize', 'secure_borders']
        }
      }
    },
    
    // Complex Relationship Matrix
    relationships: {
      usa: {
        britain: { value: 75, trust: 60, trade: 85, trend: 'stable', treaties: ['trade'] },
        france: { value: 70, trust: 55, trade: 60, trend: 'stable', treaties: [] },
        germany: { value: 25, trust: 10, trade: 30, trend: 'declining', treaties: [] },
        japan: { value: 20, trust: 15, trade: 45, trend: 'hostile', treaties: [] },
        sovietUnion: { value: 35, trust: 30, trade: 5, trend: 'cautious', treaties: [] }
      },
      // ... other relationship matrices
    },
    
    // Global Systems
    globalSystems: {
      trade: {
        total_volume: 2500,
        growth_rate: -3.5,
        protectionism: 75,
        currency_stability: 60,
        trade_blocs: [
          { name: 'Sterling Area', members: ['britain', 'dominions'], strength: 80 },
          { name: 'Gold Bloc', members: ['france', 'belgium', 'switzerland'], strength: 45 }
        ]
      },
      
      ideology: {
        democracy: { strength: 45, trend: 'declining', champions: ['usa', 'britain', 'france'] },
        fascism: { strength: 30, trend: 'rising', champions: ['germany', 'italy', 'japan'] },
        communism: { strength: 20, trend: 'consolidating', champions: ['sovietUnion'] },
        authoritarianism: { strength: 5, trend: 'opportunistic', champions: [] }
      },
      
      technology: {
        military: {
          tank_development: { leaders: ['germany', 'sovietUnion'], level: 60 },
          aircraft: { leaders: ['usa', 'germany'], level: 65 },
          naval: { leaders: ['britain', 'japan', 'usa'], level: 70 },
          electronics: { leaders: ['usa', 'britain'], level: 55 }
        },
        
        civilian: {
          mass_production: { leaders: ['usa'], level: 85 },
          chemicals: { leaders: ['germany', 'usa'], level: 75 },
          medicine: { leaders: ['usa', 'germany', 'britain'], level: 70 }
        }
      }
    },
    
    // Enhanced Crisis System
    crises: {
      active: [
        {
          id: 'rhineland',
          type: 'diplomatic',
          severity: 90,
          escalation_rate: 5,
          participants: ['germany', 'france', 'britain'],
          possible_outcomes: [
            { id: 'war', probability: 15, consequences: 'immediate' },
            { id: 'acceptance', probability: 70, consequences: 'long_term' },
            { id: 'compromise', probability: 15, consequences: 'mixed' }
          ],
          player_influence: 35,
          time_pressure: 3
        },
        {
          id: 'spanish_civil_war',
          type: 'proxy_conflict',
          severity: 70,
          escalation_rate: 3,
          participants: ['spain_republicans', 'spain_nationalists'],
          supporters: {
            republicans: ['sovietUnion', 'mexico'],
            nationalists: ['germany', 'italy']
          },
          possible_outcomes: [
            { id: 'republican_victory', probability: 30 },
            { id: 'nationalist_victory', probability: 60 },
            { id: 'international_war', probability: 10 }
          ],
          player_influence: 25,
          time_pressure: 24
        }
      ],
      
      potential: [
        {
          id: 'china_incident',
          trigger_conditions: { japan_aggression: 80, china_weakness: 70 },
          probability: 85,
          earliest_date: { year: 1937, month: 7 }
        },
        {
          id: 'anschluss',
          trigger_conditions: { german_strength: 70, austrian_weakness: 80 },
          probability: 90,
          earliest_date: { year: 1938, month: 3 }
        }
      ]
    },
    
    // Timeline Tracking
    timeline: {
      historical_path: true,
      divergence_score: 0,
      major_divergences: [],
      butterfly_effects: [],
      
      key_dates: {
        rhineland: { historical: '1936-03', actual: null },
        spanish_civil_war: { historical: '1936-07', actual: null },
        china_war: { historical: '1937-07', actual: null },
        anschluss: { historical: '1938-03', actual: null },
        munich: { historical: '1938-09', actual: null },
        poland: { historical: '1939-09', actual: null }
      }
    },
    
    // Intelligence System
    intelligence: {
      usa: {
        capability: 45,
        focus: ['germany', 'japan'],
        
        reports: {
          germany: {
            military_strength: { estimate: 60, accuracy: 75, confidence: 'medium' },
            intentions: { assessment: 'expansionist', confidence: 'high' },
            internal_stability: { estimate: 80, accuracy: 85, confidence: 'medium' }
          },
          japan: {
            military_strength: { estimate: 65, accuracy: 70, confidence: 'low' },
            intentions: { assessment: 'china_focus', confidence: 'medium' },
            internal_stability: { estimate: 85, accuracy: 60, confidence: 'low' }
          }
        },
        
        operations: {
          active: [],
          available: ['diplomatic_intelligence', 'economic_espionage', 'military_attache']
        }
      }
    }
  });

  // Initialize world engine
  const [worldEngine] = useState(() => new WorldEngine(gameState));
  const [simulationPaused, setSimulationPaused] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedDecisions, setSelectedDecisions] = useState({});
  const [detailView, setDetailView] = useState(null);

  // ==== ENHANCED TURN GENERATION ====
  const generateTurnContent = useCallback((state) => {
    const scenarios = [];
    const worldAnalysis = analyzeComplexWorldState(state);
    
    // Generate scenarios based on comprehensive world analysis
    scenarios.push(...generateCrisisScenarios(state, worldAnalysis));
    scenarios.push(...generateOpportunityScenarios(state, worldAnalysis));
    scenarios.push(...generateEmergentScenarios(state, worldAnalysis));
    
    // AI nations make their moves
    const aiActions = worldEngine.simulateOtherNations(state);
    scenarios.push(...processAIActions(aiActions, state));
    
    return prioritizeScenarios(scenarios, state, worldAnalysis);
  }, [worldEngine]);

  const analyzeComplexWorldState = (state) => {
    return {
      // Power Balance
      powerBalance: calculateGlobalPowerBalance(state),
      
      // Economic Health
      globalEconomy: analyzeGlobalEconomy(state),
      
      // Ideological Struggle
      ideologicalBalance: analyzeIdeologicalBalance(state),
      
      // Regional Stability
      regionalStability: analyzeRegionalStability(state),
      
      // Technology Race
      techRace: analyzeTechnologyRace(state),
      
      // Crisis Potential
      crisisPotential: calculateCrisisPotential(state),
      
      // Player Standing
      playerInfluence: calculatePlayerInfluence(state)
    };
  };

  const calculateGlobalPowerBalance = (state) => {
    const powers = {};
    
    Object.entries(state.nations).forEach(([nation, data]) => {
      powers[nation] = {
        total: 0,
        economic: (data.economy.gdp / 1000) * 30,
        military: data.military.totalStrength,
        diplomatic: calculateDiplomaticInfluence(nation, state),
        technological: data.military.technology?.level || 50,
        internal: data.internal?.legitimacy || data.legitimacy || 70
      };
      
      powers[nation].total = Object.values(powers[nation])
        .filter(v => typeof v === 'number')
        .reduce((a, b) => a + b, 0) / 5;
    });
    
    // Add USA
    powers.usa = {
      economic: (state.player.economy.gdp / 1000) * 30,
      military: state.player.military.totalStrength,
      diplomatic: calculateDiplomaticInfluence('usa', state),
      technological: state.player.military.technology.level,
      internal: state.player.legitimacy
    };
    powers.usa.total = Object.values(powers.usa).reduce((a, b) => a + b, 0) / 5;
    
    return powers;
  };

  const calculateDiplomaticInfluence = (nation, state) => {
    let influence = 50;
    
    // Count allies and trade partners
    const relationships = state.relationships[nation] || {};
    Object.values(relationships).forEach(rel => {
      if (rel.value > 70) influence += 5;
      if (rel.trust > 70) influence += 5;
      if (rel.trade > 70) influence += 3;
    });
    
    return Math.min(100, influence);
  };

  const analyzeGlobalEconomy = (state) => {
    const totalGDP = Object.values(state.nations).reduce((sum, nation) => 
      sum + (nation.economy?.gdp || 0), 0) + state.player.economy.gdp;
    
    const avgGrowth = Object.values(state.nations).reduce((sum, nation) => 
      sum + (nation.economy?.gdpGrowth || 0), 0) / Object.keys(state.nations).length;
    
    return {
      totalGDP,
      avgGrowth,
      tradeVolume: state.globalSystems.trade.total_volume,
      protectionism: state.globalSystems.trade.protectionism,
      trend: avgGrowth > 2 ? 'recovery' : avgGrowth > -2 ? 'stagnation' : 'depression'
    };
  };

  // ==== DECISION GENERATION WITH BRANCHING PATHS ====
  const generateDecisions = useCallback((state, worldAnalysis) => {
    const decisions = {};
    
    // Crisis Response Decisions
    state.crises.active.forEach(crisis => {
      decisions[`crisis_${crisis.id}`] = generateCrisisDecision(crisis, state, worldAnalysis);
    });
    
    // Strategic Initiatives
    if (worldAnalysis.playerInfluence > 60) {
      decisions.strategic = generateStrategicDecisions(state, worldAnalysis);
    }
    
    // Economic Policy
    decisions.economic = generateEconomicDecisions(state, worldAnalysis);
    
    // Military Doctrine
    if (worldAnalysis.crisisPotential > 70 || state.player.military.totalStrength < 50) {
      decisions.military = generateMilitaryDecisions(state, worldAnalysis);
    }
    
    // Diplomatic Initiatives
    decisions.diplomatic = generateDiplomaticDecisions(state, worldAnalysis);
    
    // Domestic Policy
    decisions.domestic = generateDomesticDecisions(state, worldAnalysis);
    
    // Special Timeline-Altering Decisions
    const divergenceDecisions = generateDivergenceDecisions(state, worldAnalysis);
    if (divergenceDecisions) {
      decisions.special = divergenceDecisions;
    }
    
    return decisions;
  }, []);

  const generateDivergenceDecisions = (state, worldAnalysis) => {
    const decisions = [];
    
    // Early intervention opportunity
    if (state.year === 1936 && state.crises.active.find(c => c.id === 'rhineland')) {
      decisions.push({
        id: 'early_intervention',
        title: 'Military Intervention Doctrine',
        description: 'Abandon isolationism and commit to military intervention against treaty violations',
        consequences: [
          'Immediate end to isolationism',
          'Possible early world war',
          'Dramatic timeline divergence',
          'Unprecedented American militarization'
        ],
        effects: {
          timeline_divergence: 100,
          isolationistSentiment: -50,
          militaryStrength: 20,
          globalTension: 40
        },
        historical_note: 'This would completely alter the trajectory of American foreign policy and likely trigger an early World War'
      });
    }
    
    // Business Plot opportunity
    if (state.player.politics.factions.business.strength > 70 && 
        state.player.politics.publicSupport < 50) {
      decisions.push({
        id: 'business_plot',
        title: 'Investigate Business Plot',
        description: 'Uncover rumored conspiracy by business leaders to overthrow the government',
        consequences: [
          'Potential coup attempt',
          'Massive political crisis',
          'Fundamental change to American democracy',
          'Unknown timeline consequences'
        ],
        effects: {
          timeline_divergence: 95,
          democracy_threatened: true,
          crisis_severity: 100
        }
      });
    }
    
    // Soviet Alliance opportunity
    if (worldAnalysis.ideologicalBalance.fascism.strength > 40 &&
        state.relationships.usa.sovietUnion.value > 40) {
      decisions.push({
        id: 'soviet_alliance',
        title: 'Early Soviet-American Cooperation',
        description: 'Propose unprecedented cooperation with Soviet Union against fascism',
        consequences: [
          'Shocks global politics',
          'Domestic political explosion',
          'Changes Cold War trajectory',
          'Accelerates anti-fascist coalition'
        ],
        effects: {
          timeline_divergence: 85,
          relationship_sovietUnion: 40,
          relationship_germany: -30,
          domestic_chaos: 30
        }
      });
    }
    
    return decisions.length > 0 ? {
      title: 'Historical Divergence Points',
      description: 'Decisions that will fundamentally alter the timeline',
      critical: true,
      options: decisions
    } : null;
  };

  const generateCrisisDecision = (crisis, state, worldAnalysis) => {
    const options = [];
    
    // Dynamic option generation based on crisis type and severity
    if (crisis.type === 'diplomatic') {
      options.push({
        id: 'diplomatic_solution',
        title: 'Diplomatic Intervention',
        description: `Use American influence to mediate ${crisis.id} crisis`,
        requirements: { diplomatic_influence: 60 },
        success_chance: calculateDiplomaticSuccess(crisis, state),
        consequences: generateDiplomaticConsequences(crisis, state)
      });
      
      if (crisis.severity > 80) {
        options.push({
          id: 'military_deterrence',
          title: 'Military Deterrence',
          description: 'Deploy forces to deter escalation',
          requirements: { military_strength: 50, public_support: 60 },
          success_chance: calculateMilitaryDeterrenceSuccess(crisis, state),
          consequences: generateMilitaryConsequences(crisis, state)
        });
      }
    }
    
    // Always include option to stay neutral
    options.push({
      id: 'maintain_neutrality',
      title: 'Maintain Neutrality',
      description: 'Avoid direct involvement in the crisis',
      requirements: {},
      success_chance: 100,
      consequences: ['Preserves isolationist support', 'May embolden aggressors', 'Reduces international influence']
    });
    
    return {
      title: `${crisis.id.charAt(0).toUpperCase() + crisis.id.slice(1)} Crisis Response`,
      description: `Crisis severity: ${crisis.severity}/100. Time pressure: ${crisis.time_pressure} turns.`,
      urgent: crisis.time_pressure <= 2,
      options
    };
  };

  // ==== ENHANCED UI COMPONENTS ====
  const DashboardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* World Situation Overview */}
      <div className="lg:col-span-2 space-y-6">
        <WorldSituationPanel />
        <ActiveCrisesPanel />
        <IntelligenceReportsPanel />
        <RecentEventsPanel />
      </div>
      
      {/* National Status */}
      <div className="space-y-6">
        <NationalStatusPanel />
        <TimelineTrackerPanel />
        <QuickActionsPanel />
      </div>
    </div>
  );

  const WorldSituationPanel = () => {
    const worldAnalysis = useMemo(() => analyzeComplexWorldState(gameState), [gameState]);
    
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
          <Globe className="w-6 h-6 mr-2" />
          World Situation - {getMonthName(gameState.month)} {gameState.year}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700 rounded p-4">
            <h3 className="font-bold text-yellow-400 mb-2">Global Power Balance</h3>
            {Object.entries(worldAnalysis.powerBalance)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 5)
              .map(([nation, power]) => (
                <div key={nation} className="flex justify-between items-center mb-2">
                  <span className="capitalize">{nation}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-600 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${power.total}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{Math.round(power.total)}</span>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="bg-gray-700 rounded p-4">
            <h3 className="font-bold text-green-400 mb-2">Economic Indicators</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Global GDP</span>
                <span className="font-bold">${worldAnalysis.globalEconomy.totalGDP}B</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Growth</span>
                <span className={`font-bold ${
                  worldAnalysis.globalEconomy.avgGrowth > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {worldAnalysis.globalEconomy.avgGrowth.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trade Volume</span>
                <span className="font-bold">${worldAnalysis.globalEconomy.tradeVolume}B</span>
              </div>
              <div className="flex justify-between">
                <span>Protectionism</span>
                <span className="font-bold text-yellow-400">
                  {worldAnalysis.globalEconomy.protectionism}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded p-4">
          <h3 className="font-bold text-purple-400 mb-2">Ideological Balance</h3>
          <div className="space-y-2">
            {Object.entries(gameState.globalSystems.ideology).map(([ideology, data]) => (
              <div key={ideology} className="flex items-center justify-between">
                <span className="capitalize">{ideology}</span>
                <div className="flex items-center flex-1 mx-4">
                  <div className="w-full bg-gray-600 rounded-full h-3 relative">
                    <div 
                      className={`h-3 rounded-full ${
                        ideology === 'democracy' ? 'bg-blue-500' :
                        ideology === 'fascism' ? 'bg-red-500' :
                        ideology === 'communism' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${data.strength}%` }}
                    />
                  </div>
                </div>
                <span className="font-bold w-12 text-right">{data.strength}%</span>
                <span className={`ml-2 text-sm ${
                  data.trend === 'rising' ? 'text-red-400' :
                  data.trend === 'declining' ? 'text-green-400' :
                  'text-gray-400'
                }`}>
                  {data.trend === 'rising' ? '↑' : data.trend === 'declining' ? '↓' : '→'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ActiveCrisesPanel = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-400 flex items-center">
        <AlertTriangle className="w-6 h-6 mr-2" />
        Active Crises
      </h2>
      
      <div className="space-y-4">
        {gameState.crises.active.map(crisis => (
          <div key={crisis.id} className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-red-300 capitalize">
                {crisis.id.replace(/_/g, ' ')}
              </h3>
              <span className="text-xs bg-red-700 px-2 py-1 rounded">
                {crisis.type}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-400">Severity:</span>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-red-500"
                    style={{ width: `${crisis.severity}%` }}
                  />
                </div>
              </div>
              <div>
                <span className="text-gray-400">Time Pressure:</span>
                <span className={`ml-2 font-bold ${
                  crisis.time_pressure <= 2 ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {crisis.time_pressure} turns
                </span>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-400">Participants:</span>
              <span className="ml-2">{crisis.participants.join(', ')}</span>
            </div>
            
            <button 
              onClick={() => setDetailView({ type: 'crisis', data: crisis })}
              className="mt-3 text-xs bg-red-700 hover:bg-red-600 px-3 py-1 rounded"
            >
              View Details & Options
            </button>
          </div>
        ))}
        
        {gameState.crises.active.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No active crises at this time
          </div>
        )}
      </div>
    </div>
  );

  const IntelligenceReportsPanel = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
        <Eye className="w-6 h-6 mr-2" />
        Intelligence Reports
      </h2>
      
      <div className="space-y-4">
        {Object.entries(gameState.intelligence.usa.reports).map(([nation, report]) => (
          <div key={nation} className="bg-gray-700 rounded p-4">
            <h3 className="font-bold text-white capitalize mb-2">{nation}</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Military Strength:</span>
                <div className="flex items-center mt-1">
                  <span className="font-bold">{report.military_strength.estimate}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({report.military_strength.confidence} confidence)
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-gray-400">Intentions:</span>
                <div className="mt-1">
                  <span className="font-bold text-yellow-400">
                    {report.intentions.assessment}
                  </span>
                </div>
              </div>
              
              <div className="col-span-2">
                <span className="text-gray-400">Internal Stability:</span>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-600 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${report.internal_stability.estimate}%` }}
                    />
                  </div>
                  <span className="text-xs">{report.internal_stability.estimate}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NationalStatusPanel = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        United States Status
      </h2>
      
      <div className="space-y-4">
        {/* Key Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <StatusIndicator 
            label="Public Support" 
            value={gameState.player.politics.publicSupport} 
            color="blue"
          />
          <StatusIndicator 
            label="Congress" 
            value={gameState.player.politics.congressSupport} 
            color="purple"
          />
          <StatusIndicator 
            label="Economy" 
            value={Math.round(100 - gameState.player.economy.unemployment * 3)} 
            color="green"
          />
          <StatusIndicator 
            label="Military" 
            value={gameState.player.military.totalStrength} 
            color="red"
          />
        </div>
        
        {/* Economic Details */}
        <div className="bg-gray-700 rounded p-3">
          <h4 className="font-bold text-green-400 mb-2">Economic Details</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>GDP Growth</span>
              <span className={gameState.player.economy.gdpGrowth > 0 ? 'text-green-400' : 'text-red-400'}>
                {gameState.player.economy.gdpGrowth.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Unemployment</span>
              <span className="text-yellow-400">{gameState.player.economy.unemployment}%</span>
            </div>
            <div className="flex justify-between">
              <span>Treasury</span>
              <span className={gameState.player.economy.treasury > 20 ? 'text-green-400' : 'text-red-400'}>
                ${gameState.player.economy.treasury}B
              </span>
            </div>
          </div>
        </div>
        
        {/* Political Factions */}
        <div className="bg-gray-700 rounded p-3">
          <h4 className="font-bold text-purple-400 mb-2">Political Factions</h4>
          <div className="text-sm space-y-2">
            {Object.entries(gameState.player.politics.factions).map(([faction, data]) => (
              <div key={faction}>
                <div className="flex justify-between items-center">
                  <span className="capitalize">{faction}</span>
                  <span className={`font-bold ${
                    data.mood === 'aggressive' ? 'text-red-400' :
                    data.mood === 'hostile' ? 'text-orange-400' :
                    data.mood === 'worried' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {data.strength}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {data.leader} • {data.mood}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const TimelineTrackerPanel = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
        <History className="w-5 h-5 mr-2" />
        Timeline Status
      </h2>
      
      <div className="space-y-3">
        <div className="bg-gray-700 rounded p-3">
          <div className="flex justify-between items-center mb-2">
            <span>Historical Accuracy</span>
            <span className={`font-bold ${
              gameState.timeline.divergence_score < 20 ? 'text-green-400' :
              gameState.timeline.divergence_score < 50 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {100 - gameState.timeline.divergence_score}%
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500"
              style={{ width: `${gameState.timeline.divergence_score}%` }}
            />
          </div>
        </div>
        
        {gameState.timeline.major_divergences.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3">
            <h4 className="font-bold text-yellow-400 mb-2">Major Divergences</h4>
            <div className="text-sm space-y-1">
              {gameState.timeline.major_divergences.slice(-3).map((div, i) => (
                <div key={i} className="text-yellow-300">
                  • {div.decision} (Turn {div.turn})
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setDetailView({ type: 'timeline' })}
          className="w-full bg-yellow-700 hover:bg-yellow-600 px-3 py-2 rounded text-sm"
        >
          View Full Timeline
        </button>
      </div>
    </div>
  );

  const StatusIndicator = ({ label, value, color }) => (
    <div className="bg-gray-700 rounded p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}%</div>
      <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
        <div 
          className={`h-1 rounded-full bg-${color}-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  const QuickActionsPanel = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
      
      <div className="space-y-2">
        <button 
          onClick={() => setCurrentView('decisions')}
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded flex items-center justify-center"
        >
          <Crown className="w-4 h-4 mr-2" />
          Make Decisions
        </button>
        
        <button 
          onClick={() => setCurrentView('intelligence')}
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          Intelligence Operations
        </button>
        
        <button 
          onClick={() => setCurrentView('diplomacy')}
          className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded flex items-center justify-center"
        >
          <Network className="w-4 h-4 mr-2" />
          Diplomatic Actions
        </button>
        
        <button 
          onClick={handleEndTurn}
          disabled={Object.keys(selectedDecisions).length < 2}
          className={`w-full px-4 py-3 rounded flex items-center justify-center ${
            Object.keys(selectedDecisions).length >= 2
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4 mr-2" />
          End Turn ({Object.keys(selectedDecisions).length}/2)
        </button>
      </div>
    </div>
  );

  const RecentEventsPanel = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
        <Zap className="w-5 h-5 mr-2" />
        Recent Events
      </h2>
      {gameState.turnEvents.length === 0 ? (
        <div className="text-gray-400">No notable events this turn.</div>
      ) : (
        <ul className="space-y-2 text-sm">
          {gameState.turnEvents.map((evt, idx) => (
            <li key={idx} className="bg-gray-700 rounded p-3">
              <div className="font-bold text-white">{evt.content.title}</div>
              <div className="text-gray-300">{evt.content.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ==== DECISION VIEW ====
  const DecisionView = () => {
    const worldAnalysis = useMemo(() => analyzeComplexWorldState(gameState), [gameState]);
    const decisions = useMemo(() => generateDecisions(gameState, worldAnalysis), [gameState, worldAnalysis]);
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Presidential Decisions</h2>
          <p className="text-gray-300">
            Select at least 2 decisions to advance to the next turn. Your choices will shape the course of history.
          </p>
        </div>
        
        {Object.entries(decisions).map(([category, decision]) => (
          <DecisionCard 
            key={category}
            category={category}
            decision={decision}
            selected={selectedDecisions[category]}
            onSelect={(optionId) => setSelectedDecisions(prev => ({
              ...prev,
              [category]: optionId
            }))}
          />
        ))}
      </div>
    );
  };

  const DecisionCard = ({ category, decision, selected, onSelect }) => (
    <div className={`bg-gray-800 rounded-lg p-6 ${
      decision.critical ? 'border-2 border-red-500' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{decision.title}</h3>
          <p className="text-gray-300 mt-1">{decision.description}</p>
        </div>
        {decision.urgent && (
          <span className="bg-red-600 text-white px-3 py-1 rounded text-sm">
            URGENT
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decision.options.map(option => (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selected === option.id
                ? 'border-blue-500 bg-blue-900/30'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <h4 className="font-bold text-white mb-2">{option.title}</h4>
            <p className="text-gray-300 text-sm mb-3">{option.description}</p>
            
            {option.requirements && Object.keys(option.requirements).length > 0 && (
              <div className="text-xs text-yellow-400 mb-2">
                Requirements: {Object.entries(option.requirements)
                  .map(([req, val]) => `${req}: ${val}`)
                  .join(', ')}
              </div>
            )}
            
            {option.success_chance !== undefined && (
              <div className="text-xs text-green-400 mb-2">
                Success Chance: {option.success_chance}%
              </div>
            )}
            
            <div className="text-xs text-gray-400">
              {option.consequences.slice(0, 3).map((cons, i) => (
                <div key={i}>• {cons}</div>
              ))}
            </div>
            
            {option.historical_note && (
              <div className="mt-2 text-xs text-yellow-500 italic">
                Historical Note: {option.historical_note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ==== HELPER FUNCTIONS ====
  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  const calculateDiplomaticSuccess = (crisis, state) => {
    let baseChance = 50;
    
    // Modify based on diplomatic influence
    const influence = calculatePlayerInfluence(state);
    baseChance += (influence - 50) * 0.5;
    
    // Modify based on relationships with crisis participants
    crisis.participants.forEach(participant => {
      const rel = state.relationships.usa[participant];
      if (rel) {
        baseChance += (rel.trust - 50) * 0.3;
      }
    });
    
    return Math.max(10, Math.min(90, Math.round(baseChance)));
  };

  const calculateMilitaryDeterrenceSuccess = (crisis, state) => {
    let baseChance = 40;
    
    // Military strength impact
    baseChance += (state.player.military.totalStrength - 50) * 0.8;
    
    // Readiness impact
    baseChance += (state.player.military.readiness - 50) * 0.4;
    
    // Public support impact
    baseChance += (state.player.politics.publicSupport - 50) * 0.3;
    
    return Math.max(20, Math.min(85, Math.round(baseChance)));
  };

  const generateDiplomaticConsequences = (crisis, state) => {
    const consequences = [];
    
    if (crisis.severity > 80) {
      consequences.push('Major boost to international prestige if successful');
      consequences.push('Severe damage to credibility if failed');
    }
    
    consequences.push(`Affects relations with ${crisis.participants.join(', ')}`);
    
    if (state.player.politics.factions.isolationists.strength > 60) {
      consequences.push('Strong domestic opposition from isolationists');
    }
    
    return consequences;
  };

  const generateMilitaryConsequences = (crisis, state) => {
    return [
      'Significant increase in military spending',
      'Risk of escalation to wider conflict',
      'Domestic political backlash possible',
      `Global tension increase by ${Math.round(crisis.severity * 0.3)}%`
    ];
  };

  const calculatePlayerInfluence = (state) => {
    let influence = 50;
    
    // Economic power
    influence += (state.player.economy.gdp / 50) - 10;
    
    // Military strength
    influence += (state.player.military.totalStrength - 50) * 0.5;
    
    // Diplomatic relationships
    let diplomaticBonus = 0;
    Object.values(state.relationships.usa || {}).forEach(rel => {
      if (rel.value > 70) diplomaticBonus += 2;
    });
    influence += diplomaticBonus;
    
    // Timeline divergence penalty
    influence -= state.timeline.divergence_score * 0.2;
    
    return Math.max(0, Math.min(100, Math.round(influence)));
  };

  const analyzeIdeologicalBalance = (state) => {
    return state.globalSystems.ideology;
  };

  const analyzeRegionalStability = (state) => {
    return {
      europe: calculateRegionalStability(['germany', 'france', 'britain'], state),
      asia: calculateRegionalStability(['japan', 'china'], state),
      americas: calculateRegionalStability(['usa'], state)
    };
  };

  const calculateRegionalStability = (nations, state) => {
    let stability = 70;
    
    nations.forEach(nation => {
      const data = nation === 'usa' ? state.player : state.nations[nation];
      if (data) {
        if (data.military?.totalStrength > 70) stability -= 10;
        if (data.economy?.gdpGrowth < -2) stability -= 5;
      }
    });
    
    return Math.max(0, Math.min(100, stability));
  };

  const analyzeTechnologyRace = (state) => {
    return state.globalSystems.technology;
  };

  const calculateCrisisPotential = (state) => {
    let potential = 30;
    
    // Active crises
    state.crises.active.forEach(crisis => {
      potential += crisis.severity * 0.3;
    });
    
    // Global tension
    if (state.globalSystems?.trade?.protectionism > 70) potential += 10;
    
    // Ideological conflict
    const fascismStrength = state.globalSystems.ideology.fascism.strength;
    if (fascismStrength > 30) potential += fascismStrength * 0.5;
    
    return Math.min(100, Math.round(potential));
  };

  const generateCrisisScenarios = (state, worldAnalysis) => {
    return state.crises.active.map(crisis => ({
      type: 'crisis',
      priority: crisis.severity,
      content: {
        title: `${crisis.id} Crisis Update`,
        description: `Crisis severity: ${crisis.severity}. Time remaining: ${crisis.time_pressure} turns.`,
        details: generateCrisisDetails(crisis, state, worldAnalysis)
      }
    }));
  };

  const generateCrisisDetails = (crisis, state, worldAnalysis) => {
    return {
      participants: crisis.participants,
      escalation_risk: crisis.escalation_rate,
      possible_interventions: generatePossibleInterventions(crisis, state),
      likely_outcome: predictCrisisOutcome(crisis, state, worldAnalysis)
    };
  };

  const generatePossibleInterventions = (crisis, state) => {
    const interventions = [];
    
    if (state.player.military.totalStrength > 50) {
      interventions.push('Military deterrence');
    }
    
    if (calculatePlayerInfluence(state) > 60) {
      interventions.push('Diplomatic mediation');
    }
    
    interventions.push('Economic sanctions');
    interventions.push('Maintain neutrality');
    
    return interventions;
  };

  const predictCrisisOutcome = (crisis, state, worldAnalysis) => {
    const outcomes = crisis.possible_outcomes || [];
    
    // Calculate modified probabilities based on world state
    return outcomes.map(outcome => ({
      ...outcome,
      probability: calculateModifiedProbability(outcome, crisis, state, worldAnalysis)
    })).sort((a, b) => b.probability - a.probability)[0];
  };

  const calculateModifiedProbability = (outcome, crisis, state, worldAnalysis) => {
    let prob = outcome.probability;
    
    // Modify based on player actions and world state
    if (outcome.id === 'war' && worldAnalysis.crisisPotential > 80) {
      prob += 10;
    }
    
    return Math.max(0, Math.min(100, prob));
  };

  const generateOpportunityScenarios = (state, worldAnalysis) => {
    const opportunities = [];
    
    // Economic opportunities
    if (worldAnalysis.globalEconomy.avgGrowth > 2) {
      opportunities.push({
        type: 'opportunity',
        priority: 60,
        content: {
          title: 'Global Economic Recovery',
          description: 'Improving global economy creates opportunities for American leadership'
        }
      });
    }
    
    // Alliance opportunities
    Object.entries(state.relationships.usa).forEach(([nation, rel]) => {
      if (rel.value > 70 && rel.trust > 60) {
        opportunities.push({
          type: 'opportunity',
          priority: 50,
          content: {
            title: `Strengthen Alliance with ${nation}`,
            description: `High trust creates opportunity for deeper cooperation`
          }
        });
      }
    });
    
    return opportunities;
  };

  const generateEmergentScenarios = (state, worldAnalysis) => {
    const scenarios = [];
    
    // Check for emerging patterns
    if (worldAnalysis.ideologicalBalance.fascism.strength > 35 && 
        worldAnalysis.ideologicalBalance.fascism.trend === 'rising') {
      scenarios.push({
        type: 'emergent',
        priority: 70,
        content: {
          title: 'Rising Fascist Tide',
          description: 'Fascist ideology spreading rapidly across multiple nations',
          implications: 'Democratic nations must coordinate response or face isolation'
        }
      });
    }
    
    return scenarios;
  };

  const processAIActions = (aiActions, state) => {
    const scenarios = [];
    
    Object.entries(aiActions).forEach(([nation, actions]) => {
      actions.forEach(action => {
        if (action.type === 'aggressive_action') {
          scenarios.push({
            type: 'ai_action',
            priority: 80,
            content: {
              title: `${nation} Takes Aggressive Action`,
              description: `${nation} initiates ${action.action} against ${action.target}`,
              implications: generateActionImplications(action, nation, state)
            }
          });
        }
      });
    });
    
    return scenarios;
  };

  const generateActionImplications = (action, nation, state) => {
    const implications = [];
    
    if (action.type === 'aggressive_action') {
      implications.push('Increases regional tensions');
      implications.push('May trigger alliance obligations');
      implications.push('Creates intervention opportunity');
    }
    
    return implications;
  };

  const prioritizeScenarios = (scenarios, state, worldAnalysis) => {
    return scenarios
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  };

  const generateStrategicDecisions = (state, worldAnalysis) => {
    return {
      title: 'Strategic Initiative',
      description: 'Your high influence allows for bold strategic moves',
      options: [
        {
          id: 'atlantic_charter',
          title: 'Propose Atlantic Charter',
          description: 'Create framework for democratic cooperation',
          consequences: ['Strengthens democratic alliance', 'Angers isolationists', 'Defines post-war order']
        },
        {
          id: 'arsenal_democracy',
          title: 'Arsenal of Democracy',
          description: 'Transform America into supplier of democratic nations',
          consequences: ['Economic boom', 'Military-industrial growth', 'Ends neutrality debate']
        },
        {
          id: 'four_freedoms',
          title: 'Articulate Four Freedoms',
          description: 'Define American values for global audience',
          consequences: ['Moral leadership', 'Inspires resistance movements', 'Ideological clarity']
        }
      ]
    };
  };

  const generateEconomicDecisions = (state, worldAnalysis) => {
    const options = [];
    
    // Dynamic options based on economic state
    if (state.player.economy.unemployment > 15) {
      options.push({
        id: 'massive_works',
        title: 'Massive Public Works',
        description: 'Launch unprecedented infrastructure program',
        consequences: ['Unemployment -8%', 'Debt increases', 'Regional development']
      });
    }
    
    if (worldAnalysis.globalEconomy.protectionism > 70) {
      options.push({
        id: 'trade_liberalization',
        title: 'Trade Liberalization Initiative',
        description: 'Lead effort to reduce global trade barriers',
        consequences: ['Improves global economy', 'Domestic opposition', 'Long-term benefits']
      });
    }
    
    options.push({
      id: 'balanced_approach',
      title: 'Balanced Economic Policy',
      description: 'Moderate spending with targeted investments',
      consequences: ['Sustainable growth', 'Gradual improvement', 'Political stability']
    });
    
    return {
      title: 'Economic Policy',
      description: 'Guide American economic recovery and growth',
      options
    };
  };

  const generateMilitaryDecisions = (state, worldAnalysis) => {
    return {
      title: 'Military Policy',
      description: 'Prepare America for potential conflicts',
      options: [
        {
          id: 'rapid_buildup',
          title: 'Rapid Military Buildup',
          description: 'Dramatically expand military forces',
          consequences: ['Military strength +20', 'Economic stimulus', 'Isolationist opposition']
        },
        {
          id: 'naval_focus',
          title: 'Two-Ocean Navy',
          description: 'Focus on naval supremacy in Atlantic and Pacific',
          consequences: ['Naval power projection', 'Deters Japan', 'Expensive program']
        },
        {
          id: 'air_power',
          title: 'Air Power Doctrine',
          description: 'Invest heavily in strategic bombing capability',
          consequences: ['Technological advancement', 'New warfare doctrine', 'Industrial development']
        }
      ]
    };
  };

  const generateDiplomaticDecisions = (state, worldAnalysis) => {
    const options = [];
    
    // Dynamic diplomatic options
    Object.entries(state.relationships.usa).forEach(([nation, rel]) => {
      if (rel.value < 40 && nation !== 'germany') {
        options.push({
          id: `improve_${nation}`,
          title: `Improve Relations with ${nation}`,
          description: `Diplomatic outreach to improve ${nation} relations`,
          consequences: [`${nation} relations +15`, 'Diplomatic flexibility', 'May anger enemies']
        });
      }
    });
    
    if (options.length === 0) {
      options.push({
        id: 'maintain_balance',
        title: 'Maintain Diplomatic Balance',
        description: 'Continue current diplomatic approach',
        consequences: ['Stability maintained', 'No major changes', 'Flexibility preserved']
      });
    }
    
    return {
      title: 'Diplomatic Initiative',
      description: 'Shape international relationships',
      options: options.slice(0, 3)
    };
  };

  const generateDomesticDecisions = (state, worldAnalysis) => {
    return {
      title: 'Domestic Policy',
      description: 'Address internal American challenges',
      options: [
        {
          id: 'social_security_expansion',
          title: 'Expand Social Security',
          description: 'Broaden social safety net coverage',
          consequences: ['Public support +10', 'Progressive satisfaction', 'Fiscal conservatives oppose']
        },
        {
          id: 'labor_relations',
          title: 'Labor Relations Act',
          description: 'Strengthen worker rights and unions',
          consequences: ['Labor support +15', 'Business opposition', 'Economic disruption risk']
        },
        {
          id: 'rural_development',
          title: 'Rural Development Program',
          description: 'Target aid to agricultural regions',
          consequences: ['Regional support', 'Agricultural recovery', 'Urban-rural balance']
        }
      ]
    };
  };

  const handleEndTurn = () => {
    if (Object.keys(selectedDecisions).length < 2) return;
    
    // Process all decisions
    const processedDecisions = {};
    Object.entries(selectedDecisions).forEach(([category, optionId]) => {
      const categoryDecisions = decisions[category];
      if (categoryDecisions) {
        const option = categoryDecisions.options.find(opt => opt.id === optionId);
        if (option) {
          processedDecisions[category] = option;
          worldEngine.recordDecision(option, gameState.turn);
        }
      }
    });
    
    // Update game state based on decisions
    // Deep-clone state to avoid accidental mutations
    let newState = structuredClone(gameState);
    
    // Apply decision effects
    Object.values(processedDecisions).forEach(decision => {
      if (decision.effects) {
        Object.entries(decision.effects).forEach(([key, value]) => {
          if (typeof value === 'number') {
            // Handle nested properties
            if (key.includes('_')) {
              const [category, subcategory] = key.split('_');
              if (newState.player[category]?.[subcategory] !== undefined) {
                newState.player[category][subcategory] += value;
              }
            } else if (newState.player[key] !== undefined) {
              newState.player[key] += value;
            }
          }
        });
      }
    });
    
    // Simulate other nations
    const aiActions = worldEngine.simulateOtherNations(newState);
    
    // Apply AI actions
    Object.entries(aiActions).forEach(([nation, actions]) => {
      actions.forEach(action => {
        // Apply action effects to world state
        if (action.type === 'aggressive_action') {
          newState.globalSystems.ideology.fascism.strength += 2;
          newState.crises.active.push({
            id: `${nation}_aggression_${Date.now()}`,
            type: 'military',
            severity: 60,
            escalation_rate: 5,
            participants: [nation, action.target],
            time_pressure: 5
          });
        }
      });
    });
    
    // Advance time
    newState.turn += 1;
    newState.month += 1;
    if (newState.month > 12) {
      newState.month = 1;
      newState.year += 1;
    }
    
    // Update crises
    newState.crises.active = newState.crises.active.map(crisis => ({
      ...crisis,
      severity: Math.min(100, crisis.severity + crisis.escalation_rate),
      time_pressure: Math.max(0, crisis.time_pressure - 1)
    })).filter(crisis => crisis.time_pressure > 0);
    
    // Check for new crises
    newState.crises.potential = newState.crises.potential.filter(potential => {
      const shouldTrigger = Math.random() * 100 < potential.probability &&
        newState.year >= potential.earliest_date.year &&
        newState.month >= potential.earliest_date.month;

      if (shouldTrigger) {
        newState.crises.active.push({
          id: potential.id,
          type: 'emerging',
          severity: 50,
          escalation_rate: 3,
          participants: [],
          time_pressure: 10
        });
        return false; // remove from potential list
      }
      return true;
    });

    // Generate events and store for this turn
    const events = generateTurnContent(newState);
    newState.turnEvents = events;
    if (DEBUG) console.log('Turn events:', events);
    worldEngine.state = newState;

    // Save to history
    if (autoSaveEnabled) {
      saveGameState(newState);
    }
    
    setGameState(newState);
    setSelectedDecisions({});
    setCurrentView('dashboard');
  };

  const saveGameState = (state) => {
    const saveData = {
      state,
      timestamp: Date.now(),
      version: '1.0.0'
    };
    
    // In a real implementation, this would save to a backend
    if (DEBUG) console.log('Game saved:', saveData);
  };

  const decisions = useMemo(() => {
    const worldAnalysis = analyzeComplexWorldState(gameState);
    return generateDecisions(gameState, worldAnalysis);
  }, [gameState, generateDecisions]);

  // Main render
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-200">
                President Franklin D. Roosevelt
              </h1>
              <p className="text-xl text-blue-300">
                {getMonthName(gameState.month)} {gameState.year} • Turn {gameState.turn}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSimulationPaused(!simulationPaused)}
                className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded flex items-center"
              >
                {simulationPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {simulationPaused ? 'Resume' : 'Pause'}
              </button>
              
              <button
                onClick={() => saveGameState(gameState)}
                className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              
              <button
                onClick={() => setCurrentView('settings')}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'decisions', label: 'Decisions', icon: Crown },
              { id: 'intelligence', label: 'Intelligence', icon: Eye },
              { id: 'diplomacy', label: 'Diplomacy', icon: Network },
              { id: 'military', label: 'Military', icon: Shield },
              { id: 'economy', label: 'Economy', icon: Database },
              { id: 'timeline', label: 'Timeline', icon: History },
              { id: 'world', label: 'World Map', icon: MapPin }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  currentView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'decisions' && <DecisionView />}
        {currentView === 'timeline' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Timeline View - Coming Soon</h2>
            <p className="text-gray-400">
              This will show a visual representation of historical divergences and butterfly effects.
            </p>
          </div>
        )}
        {currentView === 'world' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">World Map - Coming Soon</h2>
            <p className="text-gray-400">
              Interactive world map showing territories, alliances, and conflicts.
            </p>
          </div>
        )}
      </div>
      
      {/* Detail Modal */}
      {detailView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">
                {detailView.type === 'crisis' ? 'Crisis Details' : 'Timeline Details'}
              </h2>
              <button
                onClick={() => setDetailView(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* Detail content would go here */}
            <div className="text-gray-300">
              Detailed information about {detailView.type}...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
