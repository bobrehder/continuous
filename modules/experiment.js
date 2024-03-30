const canvas_size = [450, 720]
const trial_duration = 200
 
const image_files = [
  "graphics/nets/Slide1.png",
  "graphics/nets/Slide2.png",
  "graphics/nets/Slide3.png",
  "graphics/nets/Slide4.png"
]

var cc_observations = [
    [50,26,47],
    [24,50,40],
    [42,23,62],
    [34,42,41],
    [22,64,53],
    [10,23,31],
    [66,65,86],
    [89,87,68],
    [25,21,9],
    [44,36,46],
    [61,84,65],
    [48,39,54],
    [45,53,34],
    [71,77,41],
    [36,45,27],
    [53,57,42],
    [43,35,67],
    [55,57,22],
    [75,66,50],
    [72,71,77],
    [82,60,76],
    [68,49,60],
    [53,40,74],
    [60,44,54],
    [87,70,89],
    [39,61,35],
    [39,45,51],
    [31,26,17],
    [59,47,50],
    [54,53,49],
    [59,54,63],
    [18,11,33]
  ]

const continue_prompt = "<i>Press any key to continue</i>";

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function value_str(text, vals) {
  var frag = []
  var fi = 0
  for (let vi = 0; vi <= vals.length - 1; vi++) {
    if (typeof vals[vi] != 'undefined') {
      frag[fi] = text.vars.names[vi] + ' level is ' + vals[vi]
      fi++
    }
  }
  var s = "This person's " + frag[0]
  if (frag.length == 2) {
    s = s + " and their " + frag[1]
  }
  else if (frag.length == 3) {
    s = s + ", their " + frag[1] + ', and their ' + frag[2]
  }
  s = s + "."
  return (s)
}

function add_timeline_intro (timeline, domain) {
  var welcome = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Welcome to the experiment. Press any key to begin."
  };
  timeline.push(welcome);
  
  var intro_text = 
    "<h1>Introduction</h1>" +
    "<p style='text-align:center;'>In this experiment you are being asked to pretend you are a physiologist studying biological processes in the human body.</p>" +
    "<p>You perform studies in which you bring healthy people into a laboratory and measure three physiological variables:</p>" +
    "<p>" + domain.vars.names[0] + "</p><p>" + domain.vars.names[1] + "</p><p>" + domain.vars.names[2] + "</p>";
  var intro_text = 
    "<h1>Introduction</h1>" +
    "<p>In this experiment you are being asked to pretend you are a physiologist studying biological processes in the human body.</p>" +
    "<p>You perform studies in which you bring healthy people into a laboratory and measure three physiological variables. " +
    "The first variable is <b>" + domain.vars.names[0] + "</b>" + 
    ", the second variable is <b>" + domain.vars.names[1] + "</b>" + 
    ", and the third is <b>" + domain.vars.names[2] + ".</b></p>" +
    "<p>For any individual, each of these variables can be measured on a scale of 0-100. " +
    "For example, the next page presents a diagram showing the measurements for one person.</p>";

  var intro = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: intro_text,
    prompt: continue_prompt
  };
  timeline.push(intro);
}

function draw_continuous_stim(c, domain, vals, image_file_name=undefined) {
 
  function drawVarVal (var_text, val, width, height) {
    ctx.font = "20px " + font;
    var_text = var_text.split(" ");
    ctx.fillText (var_text[0], width, height);
    ctx.fillText (var_text[1], width, height + line_height);
    ctx.font = "28px " + font;
    if (typeof val == 'undefined') {
      val = '?'
    }
    ctx.fillText(val, width, height + line_height * 3);
  }
  
  var ctx = c.getContext('2d');
  const img = new Image(); 
  if (typeof image_file_name == 'undefined') {
    image_file_name = image_files[0]
  }
  img.src = image_file_name; 
  ctx.drawImage(img,0,0)
  let line_height = 25;
  let font = "Arial"
  ctx.textAlign = "center";
  drawVarVal (domain.vars.names[0], vals[0], c.width*.25, c.height*.65);
  drawVarVal (domain.vars.names[1], vals[1], c.width*.50, c.height*.15);
  drawVarVal (domain.vars.names[2], vals[2], c.width*.75, c.height*.65);
}

function observation1_task (domain, vals, prompt, image_file_name=undefined) {
  var stim = {
      type: jsPsychCanvasKeyboardResponse,
      canvas_size: canvas_size,
      stimulus: function (c) {
        draw_continuous_stim(c, domain, vals, image_file_name)
      },
      prompt: prompt + continue_prompt
  }
  return (stim)
}

function add_timeline_observation1 (timeline, domain, vals, prompt, image_file_name=undefined) {
  var stim = observation1_task (domain, vals, prompt, image_file_name)
  timeline.push(stim);
}

function add_timeline_values_example (timeline, domain, vals) {  
  var vals_ex_text = "<p>" + value_str (domain, vals) + "</p>"
  add_timeline_observation1 (timeline, domain, vals, vals_ex_text);
}

function add_timeline_causal_example_and_mc (timeline, domain, vals) {

  function causal_intro_task () {
    function cause_effect_str (cause, effect) {
      var s = 
        "have reason to believe that <b>" + cause + " causally influences " +  effect + "</b>." +
        " That is, as " + cause + " increases, " +  effect + " will tend to increase as well."
      return (s)
   }
 
   var causal_text = 
      "<h1>Causal Relations</h1>" +
      "<p>In addition, before starting your measurements you have reason to believe that the three variables are causally related to one another.</p>" +
      "<p>You " + cause_effect_str (domain.link_1.cause, domain.link_1.effect) + "</p>" +
      "<p>And you " + cause_effect_str (domain.link_2.cause, domain.link_2.effect) + "</p>" +
      "<p>Note that these relationships are only tendencies." + 
      " Both " + domain.link_1.effect + " and " + domain.link_2.effect + 
      " are influenced by other factors so they will not vary with their cause perfectly.</p>" +
      "<p>On the next page a graphical image of these causal relations are superimposed on the measurements for the same individual as on the previous page.</p>";
    var causal_intro = { 
      type: jsPsychHtmlKeyboardResponse,
      stimulus: causal_text,
      prompt: continue_prompt
    }
    return (causal_intro) 
  }

  function multiple_choice_intro () {
   var intro_text = 
      "<h1>Causal Knowledge Test</h1>" +
      "<p>We would now like you to ask you a few simple questions about what you just learned.</p>" +
      "<p>Please try to answer these question correctly the first time.</p>" +
      "<p>But don't worry, if you make a mistake you'll have a chance to re-study the information and answer the questions.</p>"
    var intro_task = { 
      type: jsPsychHtmlKeyboardResponse,
      stimulus: intro_text,
      prompt: continue_prompt
    }
    return (intro_task)
  }

  function causal_example_task () {
    var causal_ex_text = 
      "<p>The arrows represent the causal relations between " + domain.link_1.cause + " and " + domain.link_1.effect + 
      ", and between " + domain.link_2.cause + " and " + domain.link_2.effect + ".</p>";
    var causal_stim = observation1_task (domain, vals, causal_ex_text, domain.arrows_img)
    return (causal_stim)
  }

  function causes_of_q_text (vi) {
     return ("<b>What does " + domain.vars.names[vi] + " cause?</b>")
   }
  function caused_by_q_text (vi) {
     return ("<b>What is " + domain.vars.names[vi] + " caused by?</b>")
   }
   

  function qs_match (responses, var_correct) { 
    function q_match (responses, var_correct) {
      if (responses.length != var_correct.length)
        return (false)
      var match = true
      for (let i = 0; i <= var_correct - 1; i++) {
        if (responses[i] != var_correct[i])
          match = false
      }
     return (match)
    } 
    var match = []
    for (let qi = 0; qi <= var_correct.length - 1; qi++) {
      match[qi] = q_match(responses[Object.keys(responses)[qi]], var_correct[qi])
    }
    return (match.every(Boolean))
  }
  
  function multiple_choice_questions (q_text_fun, correct_responses) {
    var questions = []
    for (let vi = 0; vi <= domain.vars.names.length - 1; vi++) {
      var others_s = []
      for (let vi2 = 0; vi2 <= domain.vars.names.length - 1; vi2++) {
        if (vi2 != vi) {
          others_s.push (domain.vars.names[vi2])
        }
      }
      questions.push({prompt: q_text_fun (vi), options: others_s, horizontal: true, required: false})
     }
    var questions_task = {
      type: jsPsychSurveyMultiSelect,
      questions: questions,
      preamble: "<p>For each question, select 0-2 responses.<p>",
      on_finish: function (data) {
        data.correct = qs_match(data.response, correct_responses)
      }
    }
    return (questions_task)
  }

  function feedback () {
    var last_trials = jsPsych.data.get().last(2).values()
    var correct = last_trials[0].correct && last_trials[1].correct
    correct = true
    jsPsych.data.addProperties({correct: correct})
    if (correct) {
      var feedback_text = 
        "<h1>Congratulations! You answered all the questions correctly!</h1>" +
        "<h1>You are now ready to move on to the rest of the experiment.</h1>"      
   }
    else {
       var feedback_text = 
        "<h1>Sorry, you answered some of the questions incorrectly.</h1>" +
        "<p>When you continue you will be returned to the causal relationships screen.</p>" +
        "<p>After you re-study the causal relationships you'll have an opportunity to retake the test.</p>" +
        "<p>You must answer the test questions correctly in order to continue to the next part of the experiment.</p>"      
    }
    return (feedback_text)
  }
  
  var intro_task = causal_intro_task ()
  var causal_stim = causal_example_task ()
  var mc_intro = multiple_choice_intro ()
  var qs_causes_task = multiple_choice_questions(causes_of_q_text, domain.cause_of)
  var qs_caused_by_task = multiple_choice_questions(caused_by_q_text, domain.caused_by)
  var feedback_task = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: feedback,
    prompt: continue_prompt,
  }
  var loop = {
    timeline: [intro_task, causal_stim, mc_intro, qs_causes_task, qs_caused_by_task, feedback_task],
    loop_function: function (data) {
      return !jsPsych.data.get().last(1).values()[0].correct
    }
  }
  timeline.push(loop)
}

function add_timeline_observations (timeline, domain) {
 var intro_text = 
    "<h1>Observational Stage</h1>" +
    "<p>We would now like you to observe the measurements for 32 individuals.</p>" +
    "<p>On the basis of these observations, we'd like you to form an impression of how often the measured variables take on different values.</p>" +
    "<p>And please form an impression of the strength of the causal relations between " + domain.link_1.cause + " and " + domain.link_1.effect +
    " and between "  + domain.link_2.cause + " and " + domain.link_2.effect + ".</p>" +
    "<p>Each individual will be displayed on a separate page. Please study each individual carefully and then hit a key to move on to the next one.</p>";
  var intro_task = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: intro_text,
    prompt: continue_prompt
  };
  timeline.push(intro_task);


  shuffleArray (domain.obs);
  for (let o = 0; o <= domain.obs.length - 30; o++) {
    var wait_task =  {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "Please wait. Measurements for individual " + (o + 1).toString() + " are loading...",
      trial_duration: trial_duration
    }
    timeline.push(wait_task);
    add_timeline_observation1 (timeline, domain, domain.obs[o], "", domain.arrows_img);
  }
}

function add_timeline_test (timeline, domain) {
  function jitter_stim (stim) {
    for (let i = 0; i <= stim.length - 1; i++) {
      if (typeof stim[i] != 'undefined') {
        stim[i] = Math.round (stim[i] + 10 * (Math.random() - .5))
      }
    }
    return (stim)
  } 
  
  var test_items = [
    // Markov (predict var 0)
    {stim: [undefined, 40, 30], query_var: 0},
    {stim: [undefined, 40, 50], query_var: 0},
    {stim: [undefined, 40, 70], query_var: 0},
    {stim: [undefined, 60, 30], query_var: 0},
    {stim: [undefined, 60, 50], query_var: 0},
    {stim: [undefined, 60, 70], query_var: 0},
    // Markov (predict var 2)
    {stim: [30, 40, undefined], query_var: 2},
    {stim: [50, 40, undefined], query_var: 2},
    {stim: [70, 40, undefined], query_var: 2},
    {stim: [30, 60, undefined], query_var: 2},
    {stim: [50, 60, undefined], query_var: 2},
    {stim: [70, 60, undefined], query_var: 2},
    // Transitive
    {stim: [undefined, undefined, 30], query_var: 0},
    {stim: [undefined, undefined, 50], query_var: 0},
    {stim: [undefined, undefined, 70], query_var: 0},
    {stim: [30, undefined, undefined], query_var: 2},
    {stim: [50, undefined, undefined], query_var: 2},
    {stim: [70, undefined, undefined], query_var: 2},
    // Middle
    {stim: [30, undefined, 40], query_var: 1},
    {stim: [50, undefined, 40], query_var: 1},
    {stim: [70, undefined, 40], query_var: 1},
    {stim: [30, undefined, 60], query_var: 1},
    {stim: [50, undefined, 60], query_var: 1},
    {stim: [70, undefined, 60], query_var: 1},
    // One link (predict 1)
    {stim: [30, undefined, undefined], query_var: 1},
    {stim: [50, undefined, undefined], query_var: 1},
    {stim: [70, undefined, undefined], query_var: 1},
    {stim: [undefined, undefined, 30], query_var: 1},
    {stim: [undefined, undefined, 50], query_var: 1},
    {stim: [undefined, undefined, 70], query_var: 1},
    // One link (predict 0)
    {stim: [undefined, 30, undefined], query_var: 0},
    {stim: [undefined, 50, undefined], query_var: 0},
    {stim: [undefined, 70, undefined], query_var: 0},
    // One link (predict 2)
    {stim: [undefined, undefined, 30], query_var: 2},
    {stim: [undefined, undefined, 65], query_var: 2},
    {stim: [undefined, undefined, 70], query_var: 2}
  ]
  var test_intro_text = 
    "<h1>Prediction Stage</h1>" + 
    "<p>On the basis of what you just learned, we would now like you to make predictions about a new group of individuals.</p>" +
    "<p>For each individual we know the level of some of the variables but some of the measurements are missing." +
    " We'd like you to predict the value of one of the missing measurements.</p>" +
    "<p>We'd like you to make predictions for " + test_items.length + " individuals.</p>"
  var cp_intro = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: test_intro_text,
    prompt: continue_prompt
  };
  timeline.push(cp_intro);
  
  shuffleArray (test_items);
  for (let o = 0; o <= test_items.length - 1; o++) {
    var wait_task =  {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "Please wait. The next test individual is loading...",
      trial_duration: trial_duration
    }
    timeline.push(wait_task);
    
    test_items[o].stim = jitter_stim (test_items[o].stim)
    var prompt = 
      "<p>" + value_str(domain, test_items[o].stim) +
      " Given this information, <b>what is your best estimate for their " + 
      domain.vars.names[test_items[o].query_var] + " level?</b></p>"
    var test_item = {
      type: jsPsychCanvasSliderResponse,
      labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      require_movement: false,
      canvas_size: canvas_size,
      stimulus: function (c) {
        draw_continuous_stim(c, domain, test_items[o].stim, domain.arrows_img)
      },
      prompt: prompt
    }
    timeline.push(test_item);
  }
}

function add_timeline_domain (timeline, domain) {
  var example_vals = [18, 32, 41]
  add_timeline_intro (timeline, domain)
  add_timeline_values_example (timeline, domain, example_vals)
  add_timeline_causal_example_and_mc (timeline, domain, example_vals)
  add_timeline_observations (timeline, domain)
  add_timeline_test (timeline, domain)  
   var done_text = 
    "<h1>Thank You For Participating in This Experiment!</h1>" +
    "<h1>We very much appreciate your contribution to our research.</h1>"
   var done_task = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: done_text,
    prompt: "<i>Press any key to exit</i>"
  };
  timeline.push(done_task);
}

export function create_timeline (timeline) {

  function make_domain (var_text, cbn) {
    function indices_to_var_names (idxs) {
      var var_names = []
      for (let i = 0; i < idxs.length; i++) {
        var_names.push (var_text.names[i])
      }
      return (var_names)
    }
    
    var domain = {
      vars: var_text, 
      link_1: {cause: var_text.states[cbn.link_1.cause].hi, effect: var_text.states[cbn.link_1.effect].hi},
      link_2: {cause: var_text.states[cbn.link_2.cause].hi, effect: var_text.states[cbn.link_2.effect].hi},
      cause_of: [],
      caused_by: [],
      arrows_img: cbn.arrows_img,
      obs: cbn.obs
    }
    for (let vi = 0; vi <= domain.vars.names.length - 1; vi++) {
      domain.cause_of.push(indices_to_var_names (cbn.cause_of[vi]))
      domain.caused_by.push(indices_to_var_names (cbn.caused_by[vi]))
    }
    return domain
  }
  
  var cc3_cbn = {
    link_1: {cause: 1, effect: 0},
    link_2: {cause: 1, effect: 2}, 
    cause_of:  [[],[0,2],[]],
    caused_by: [[1],[],[1]],
    arrows_img: image_files[1],
    obs: cc_observations
  }
  var ch3_cbn = {
    link_1: {cause: 0, effect: 1}, 
    link_2: {cause: 1, effect: 2}, 
    cause_of:  [[1],[2],[]],
    caused_by: [[],[0],[1]],
    arrows_img: image_files[2],
    obs: cc_observations
  }
  var ce3_cbn = {
    link_1: {cause: 0, effect: 1}, 
    link_2: {cause: 2, effect: 1}, 
    cause_of:  [[1],[],[1]],
    caused_by: [[],[0,2],[]],
    arrows_img: image_files[3]
  }
  
  var absorption_var_text = {
    names: ["water absorption","protein absorption","fructose absorption"],
    states: [
      {lo: "the level of water absorption",    hi: "the level of water absorption"},
      {lo: "the level of protein absorption",  hi: "the level of protein absorption"},
      {lo: "the level of fructose absorption", hi: "the level of fructose absorption"}
    ]
  }
  
  var absorption_cc3_domain = make_domain (absorption_var_text, cc3_cbn)
  var absorption_ch3_domain = make_domain (absorption_var_text, ch3_cbn)
  
  timeline.push({type: jsPsychPreload, images: image_files, show_detailed_errors: true});
  //timeline.push({type: jsPsychFullscreen, fullscreen_mode: true});

  add_timeline_domain (timeline, absorption_ch3_domain)
}

