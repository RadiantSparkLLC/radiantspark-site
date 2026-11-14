    const RECIPES = [
      {
        id: 'rec-herb-salmon-quinoa', title: 'Lemon Herb Seared Salmon & Quinoa Bowl', style: 'high_protein',
        meta: 'Lunch · Prep 8m · Cook 14m',
        ingredients: ['150g salmon fillet', '1/2 cup cooked quinoa', '1 cup spinach & cherry tomatoes', '1/4 avocado, olive oil, lemon & dill'],
        steps: ['Rub salmon with olive oil, garlic, and lemon zest.', 'Cook salmon until the centre reaches 145°F / 63°C on a food thermometer.', 'Fluff warm quinoa and top with greens, avocado & seared fillet.']
      },
      {
        id: 'rec-moong-chilla-paneer', title: 'Moong Dal Chilla with Spiced Paneer', style: 'vegetarian_sattvik',
        meta: 'Breakfast · Prep 10m · Cook 10m',
        ingredients: ['1/2 cup soaked yellow moong dal', '60g grated fresh paneer', 'Grated ginger, cumin, coriander, turmeric', '1 tsp cold-pressed ghee'],
        steps: ['Blend soaked dal with ginger and turmeric into crepe batter.', 'Spread batter on medium cast-iron tawa.', 'Fill with spiced paneer and fold crisp. Serve with mint chutney.']
      },
      {
        id: 'rec-chickpea-tahini-bowl', title: 'Roasted Cumin Chickpea & Greens Bowl', style: 'vegan_organic',
        meta: 'Lunch · Prep 7m · Cook 18m',
        ingredients: ['1 cup drained chickpeas', '1.5 cups kale + cucumber', '1 tbsp tahini + lemon juice', 'Cumin, smoked paprika & garlic powder'],
        steps: ['Roast spiced chickpeas at 200C for 18 minutes.', 'Whisk tahini, lemon, and warm water into dressing.', 'Assemble over kale & cucumber and drizzle dressing.']
      },
      {
        id: 'rec-avocado-egg-skillet', title: 'Spinach, Walnut & Herb Omelet Skillet', style: 'keto_lowcarb',
        meta: 'Breakfast · Prep 5m · Cook 6m',
        ingredients: ['2 whole eggs + 2 egg whites', '1 cup baby spinach', '1/4 diced avocado + 4 walnut halves', '1 tsp olive oil & pepper'],
        steps: ['Wilt spinach in skillet for 45 seconds.', 'Pour whisked eggs and cook until the egg dish reaches 160°F / 71°C on a food thermometer.', 'Finish with diced avocado and crushed walnuts.']
      }
    ];

    const WORKOUTS = [
      { id: 'w1', title: 'Home Movement Sequence', level: 'Intermediate', mins: 20, met: 8.0,
        steps: [
          { name: 'Warmup March & Arm Circles', sec: 120, cue: 'Lift chest and gradually elevate heart rate.' },
          { name: 'Bodyweight Squat to Reach', sec: 45, cue: '45s work / 15s rest · sit hips back cleanly.' },
          { name: 'Mountain Climbers', sec: 45, cue: '45s work / 15s rest · brace core tight.' },
          { name: 'Reverse Alternating Lunges', sec: 45, cue: '45s work / 15s rest · drive through front heel.' }
        ]
      },
      { id: 'w2', title: 'Walk &amp; Core Sequence', level: 'Low Impact', mins: 25, met: 4.8,
        steps: [
          { name: 'Brisk Pace March', sec: 180, cue: 'Pump arms at 90 degrees with comfortable effort.' },
          { name: 'Standing Knee-to-Elbow Twist', sec: 60, cue: 'Contract obliques smoothly on exhale.' },
          { name: 'Wall Push-Ups + Glute Bridges', sec: 90, cue: 'Squeeze glutes at top for 2 seconds.' }
        ]
      },
      { id: 'w3', title: 'Evening Mobility Sequence', level: 'Beginner', mins: 15, met: 3.5,
        steps: [
          { name: 'Sun Salutation Half-Flows', sec: 180, cue: 'Slow nasal breathing across 5 rounds.' },
          { name: 'Forearm Plank Hold', sec: 45, cue: 'Choose a comfortable hold; stop when form changes or if you feel pain.' },
          { name: 'Supine Hip & Spine Stretch', sec: 120, cue: '60s per side to lower evening stress.' }
        ]
      }
    ];

