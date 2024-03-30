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

function value_str (text, vals) {
  var frag = []
  var fi = 0
  for (let vi = 0; vi <= vals.length - 1; vi++) {
    if (typeof vals[vi] != 'undefined') {
      frag[fi] = text.vars.names[vi] + ' level is ' + vals[vi]
      fi++
    }
  }
  var s = "<p>This person's " + frag[0]
  if (frag.length == 2) {
    s = s + " and their " + frag[1]
  }
  else if (frag.length == 3) {
    s = s + ", their " + frag[1] + ', and their ' + frag[2]
  }
  s = s + ".</p>"
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

function add_timeline_observation1 (timeline, domain, vals, prompt, image_file_name=undefined) {

  var stim = {
      type: jsPsychCanvasKeyboardResponse,
      canvas_size: canvas_size,
      stimulus: function (c) {
        draw_continuous_stim(c, domain, vals, image_file_name)
      },
      prompt: prompt + continue_prompt
  }
  timeline.push(stim);
}

function add_timeline_values_example (timeline, domain, vals) {
  var vals_text = 
    "<h1>Variable Measurements</h1>" +
    "<p>For any one individual, each of these variables can be measured on a scale of 0-100.</p>" +
    "<p>For example, the next page presents a diagram showing the measurements for one individual.</p>";
  var vals_explain_task = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: vals_text,
    prompt: continue_prompt
  };
  //timeline.push(vals_explain_task);
  
  var vals_ex_text = value_str (domain, vals)
  add_timeline_observation1 (timeline, domain, vals, vals_ex_text);
}

function add_timeline_causal_example (timeline, domain, vals) {
  function cause_effect_str (cause, effect) {
    var s = 
      "have reason to believe that <b>" + cause + " causally influences " +  effect + "</b>." +
      " That is, someone with a high level of " + cause + " will tend to have a high level of " +  effect + 
      " and someone with a low level of " + cause + " will tend to have a low level of " +  effect + "."
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
  var causal = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: causal_text,
    prompt: continue_prompt
  }
  timeline.push(causal)

  var causal_ex_text = 
    "<p>The arrows represent the causal relations between " + domain.link_1.cause + " and " + domain.link_1.effect + 
    ", and between " + domain.link_2.cause + " and " + domain.link_2.effect + ".</p>";
  add_timeline_observation1 (timeline, domain, vals, causal_ex_text, domain.arrows_img)
}


function add_multiple_choice (timeline, domain) {
 var intro_text = 
    "<h1>Causal Knowledge Test</h1>" +
    "<p>We would now like you to ask you a few simple questions about what you just learned.</p>"
  var intro_task = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: intro_text,
    prompt: continue_prompt
  };
  timeline.push(intro_task);

  
  var causes_qs = []
  var caused_by_qs = []
  for (let vi = 0; vi <= domain.vars.names.length - 1; vi++) {
    var others = []
    var others_s = []
    for (let vi2 = 0; vi2 <= domain.vars.names.length - 1; vi2++) {
      if (vi2 != vi) {
        others.push (vi2)
        others_s.push (domain.vars.names[vi2])
      }
    }
    var cause_q = "<b>What does " + domain.vars.names[vi] + " cause?" + " (Select 0-2 responses.)</b>"
    causes_qs.push({prompt: cause_q, options: others_s, horizontal: true, required: false})
    var caused_by_q = "<b>What is " + domain.vars.names[vi] + " caused by?" + " (Select 0-2 responses.)</b>"
    caused_by_qs.push({prompt: caused_by_q, options: others_s, horizontal: true, required: false})
  }
  timeline.push({type: jsPsychSurveyMultiSelect, questions: causes_qs})
  timeline.push({type: jsPsychSurveyMultiSelect, questions: caused_by_qs})
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
  function drawStim(c) {
    draw_continuous_stim(c, domain, vals, image_file_name)
  }

  var test_items = [
    {item: [10, 20, undefined], query_var: 2},
    {item: [80, undefined, undefined], query_var: 1}
  ]
  var test_intro_text = 
    "<h1>Question Stage</h1>" + 
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
    
    var prompt = 
      value_str(domain, test_items[o].item) +
      "<p>Given this information, <b>what do you predict their level of " + 
      domain.vars.names[test_items[o].query_var] + " is?</b></p>"
    var test_item = {
      type: jsPsychCanvasSliderResponse,
      labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      require_movement: false,
      canvas_size: canvas_size,
      stimulus: function (c) {
        draw_continuous_stim(c, domain, test_items[o].item, domain.arrows_img)
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
  add_timeline_causal_example (timeline, domain, example_vals)
  add_multiple_choice(timeline, domain)
  add_timeline_observations (timeline, domain)
  add_timeline_test (timeline, domain)  
}

export function create_timeline (timeline) {

  function make_causal_text (var_text, cbn) {
    var causal_text = {
      vars: var_text, 
      link_1: {cause: var_text.states[cbn.link_1.cause].hi, effect: var_text.states[cbn.link_1.effect].hi},
      link_2: {cause: var_text.states[cbn.link_2.cause].hi, effect: var_text.states[cbn.link_2.effect].hi},
      arrows_img: cbn.arrows_img,
      obs: cbn.obs
    };
    return causal_text;
  }
  
  var cc_cbn = {
    link_1: {cause: 1, effect: 0},
    link_2: {cause: 1, effect: 2}, 
    arrows_img: image_files[1],
    obs: cc_observations
  }
  var ch_cbn = {
    link_1: {cause: 0, effect: 1}, 
    link_2: {cause: 1, effect: 2}, 
    arrows_img: image_files[2]
  }
  var ce_cbn = {
    link_1: {cause: 0, effect: 1}, 
    link_2: {cause: 2, effect: 1}, 
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
  
  var absorption_cc_domain = make_causal_text (absorption_var_text, cc_cbn)
  var absorption_ch_domain = make_causal_text (absorption_var_text, ch_cbn)
  
  timeline.push({type: jsPsychPreload, images: image_files, show_detailed_errors: true});
  //timeline.push({type: jsPsychFullscreen, fullscreen_mode: true});

  add_timeline_domain (timeline, absorption_cc_domain)
}

