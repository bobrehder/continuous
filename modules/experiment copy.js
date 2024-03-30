let continue_prompt = "<p></p><p>Press any key to continue.</p>";

function add_timeline_intro (timeline, text) {
  var welcome = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Welcome to hell. Press any key to begin."
  };
  timeline.push(welcome);
  
  var intro_p1_s1 = "<p align='left'>In this experiment you are being asked to pretend you are a physiologist studying biological processes in the human body.</p>";
  var intro_p1_s2 = "<p>You perform studies in which you bring healthy people into a laboratory and measure three physiological variables:</p>";
  var intro_p1_s3 = "<p>" + text.vars.names[0] + "</p><p>" + text.vars.names[1] + "</p><p>" + text.vars.names[2] + "</p>";
  var intro = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Introduction",
    prompt: intro_p1_s1 + intro_p1_s2 + intro_p1_s3 + continue_prompt
  };
  timeline.push(intro);
}

function create_timeline_obs_intro (timeline, text) {
  
  var obs_p1_s1 = "<p>We would now like you to observe the measurements for 32 individuals.</p>";
  var obs_p1_s2 = "<p>On the basis of these observations, we'd like you to form an impression of how often the measured variables take on different values.</p>";
  var obs_p1_s3 = "<p>And please form an impression of the strength of the causal relations, that is how probable it is that " + text.link_1.cause + " causes " + text.link_1.effect;
  var obs_p1_s4 = " and that "  + text.link_2.cause + " causes " + text.link_2.effect + ".</p>";
  var obs_p1_s5 = "<p>Each individual will be displayed on a separate page. Please study each individual carefully and then hit a key to move on to the next one.</p>";
  var obs_intro = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Observational Stage",
    prompt: obs_p1_s1 + obs_p1_s2 + obs_p1_s3 + obs_p1_s4 + obs_p1_s5 + continue_prompt
  };
  timeline.push(obs_intro);
}

function add_timeline_continuous_stim (timeline, text, val0, val1, val2) {
function drawArrowhead(context, from, to, radius) {
	var x_center = to.x;
	var y_center = to.y;

	var angle;
	var x;
	var y;

	//context.beginPath();

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	//context.closePath();

	//context.fill();
}  

  function drawStim(c) {
    function drawArrow(ctx, from, to, radius) {
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      
	  var x_center = to.x;
	  var y_center = to.y;
      var angle = Math.atan2(to.y - from.y, to.x - from.x)
	  var x = radius * Math.cos(angle) + x_center;
	  var y = radius * Math.sin(angle) + y_center;
	  //ctx.moveTo(x, y);

	  //angle += (1.0/3.0) * (2 * Math.PI)
	  //x = radius * Math.cos(angle) + x_center;
	  //y = radius * Math.sin(angle) + y_center;
	  //ctx.lineTo(x, y);
      //ctx.stroke();

	  //angle += (1.0/3.0) * (2 * Math.PI)
	  //x = radius *Math.cos(angle) + x_center;
	  //y = radius *Math.sin(angle) + y_center;
	  //ctx.lineTo(x, y);
      //ctx.stroke();

      drawArrowhead (ctx, from, to, 1)
    }  
    function drawVarVal (var_text, val, width, height) {
      ctx.font = "20px " + font;
      var_text = var_text.split(" ");
      ctx.fillText (var_text[0], width, height);
      ctx.fillText (var_text[1], width, height + line_height);
      ctx.font = "28px " + font;
      ctx.fillText(val, width, height + line_height * 3);
    }
    var ctx = c.getContext('2d');
    ctx.rect(0, 0, c.width, c.height);
    ctx.stroke();
    let line_height = 25;
    let font = "Arial"
    ctx.textAlign = "center";
    //drawVarVal (text.vars.names[0], .20, c.width*.25, c.height*.65);
    //drawVarVal (text.vars.names[1], .33, c.width*.50, c.height*.15);
    //drawVarVal (text.vars.names[2], .62, c.width*.75, c.height*.65);
    var to = {x:200, y:200}
    var from = {x:90, y:90}
    drawArrow (ctx, from, to, 10)
  }

  var stim = {
      type: jsPsychCanvasKeyboardResponse,
      canvas_size: [500, 800],
      stimulus: drawStim,
      prompt: continue_prompt
  }
  timeline.push(stim);
}

function create_domain_timeline (timeline, text) {
  add_timeline_intro (timeline, text);
  add_timeline_continuous_stim (timeline, text, 10, 30, 65);
  
  var hilo_p1_s1 = "<p>For any one individual, each of these variables can be measured as either high (e.g., " + text.vars.states[0].hi + ") or low (e.g., " + text.vars.states[0].hi + ").</p>"
  var hilo_p1_s2 = "<p>For example, here is a diagram showing the measurements for one individual.";
  var hilo_p1_s3 = " This person has " + text.vars.state_110[0] + " (shown as a plus sign), " + text.vars.state_110[1]  + " (a plus sign), and " + text.vars.state_110[2] + " (a minus sign).</p>";
  var hilo_p1_s4 = "<img src='./graphics/chain/Slide1.jpeg' width='25%' height='auto'><p></p>";
  //var hilo_p1_s5 = "<p></p>";
  var hilo = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Variables: High or Low",
    prompt: hilo_p1_s1 + hilo_p1_s2 + hilo_p1_s3 + hilo_p1_s4 + continue_prompt
  };
  timeline.push(hilo);

  var causal_p1_s1 = "<p>In addition, before starting your measurements you have reason to believe that the three variables are causally related to one another.</p>";
  var causal_p1_s2 = "<p>You have reason to believe that " + text.link_1.cause + " increases the probability of " +  text.link_1.effect + ".</p>";
  var causal_p1_s3 = "<p>And you have reason to believe that " + text.link_2.cause + " increases the probability of " +  text.link_2.effect + ".</p>";
  var causal_p1_s4 = "<p>These causal relations are superimposed on the diagram for the same individual as on the previous page. The arrows represent the causal relations.</p>";
  var causal_p1_s5 = "<img src='./graphics/chain/Slide3.jpeg' width='25%' height='auto'><p></p>";
  var causal_intro = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Causal Relations",
    prompt: causal_p1_s1 + causal_p1_s2 + causal_p1_s3 + causal_p1_s4 + causal_p1_s5 + continue_prompt
  };
  timeline.push(causal_intro);
  
  create_timeline_obs_intro (timeline, text)
  
  var observation_types = [
    {obs: './graphics/chain/Slide2.jpeg', count: 2},
    {obs: './graphics/chain/Slide3.jpeg', count: 3},
    {obs: './graphics/chain/Slide4.jpeg', count: 1},
    {obs: './graphics/chain/Slide5.jpeg', count: 2},
    {obs: './graphics/chain/Slide6.jpeg', count: 1},
    {obs: './graphics/chain/Slide7.jpeg', count: 1},
    {obs: './graphics/chain/Slide8.jpeg', count: 1},
    {obs: './graphics/chain/Slide9.jpeg', count: 1}
  ];  
  
  var observations = [];
  var i = 0;
  var t = null;
  for (t of observation_types) {
    for (let j = 0; j < t.count; j++) {
      observations[i] = { obs: t.obs };
      i++;
    }
  }
  var observational_procedure = {
    timeline: [
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: 'Please wait. Measurements for the next individual are loading...',
            choices: "NO_KEYS",
            trial_duration: 2000
        },
        {
            type: jsPsychImageKeyboardResponse,
            stimulus: jsPsych.timelineVariable('obs'),
            prompt: "<p>Press any key to continue.</p>"
        }
    ],
    timeline_variables: observations,
    randomize_order: true
  }
  timeline.push(observational_procedure);

  var cp_p1_s1 = "<p>On the basis of what you just learned, we would now like you to make predictions about a new group of individuals.</p>";
  var cp_intro = { 
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Question Stage",
    prompt: cp_p1_s1 + continue_prompt
  };
  timeline.push(cp_intro);
  
}

export function create_timeline (timeline) {

  function make_causal_text (var_text, cbn) {
    var causal_text = {
      vars: var_text, 
      link_1: {cause: var_text.states[cbn.link_1.cause].hi, effect: var_text.states[cbn.link_1.effect].hi},
      link_2: {cause: var_text.states[cbn.link_2.cause].hi, effect: var_text.states[cbn.link_2.effect].hi}
    };
    return causal_text;
  }
  
  var absorption_var_text = {
    names: ["Water Absorption","Protein Absorption","Fructose Absorption"],
    states: [
      {lo: "a low level of water absorption",    hi: "a high level of water absorption"},
      {lo: "a low level of protein absorption",  hi: "a high level of protein absorption"},
      {lo: "a low level of fructose absorption", hi: "a high level of fructose absorption"}
    ]
  }
  absorption_var_text.state_110 = [absorption_var_text.states[0].hi,absorption_var_text.states[1].hi,absorption_var_text.states[2].lo]
  
  var chain_cbn = {link_1: {cause: 0, effect: 1}, link_2: {cause:1, effect:2}}

  
  var absorption_chain_text = make_causal_text (absorption_var_text, chain_cbn)
  create_domain_timeline (timeline, absorption_chain_text)
}

/**
 * Draw an arrowhead on a line on an HTML5 canvas.
 *
 * Based almost entirely off of http://stackoverflow.com/a/36805543/281460 with some modifications
 * for readability and ease of use.
 *
 * @param context The drawing context on which to put the arrowhead.
 * @param from A point, specified as an object with 'x' and 'y' properties, where the arrow starts
 *             (not the arrowhead, the arrow itself).
 * @param to   A point, specified as an object with 'x' and 'y' properties, where the arrow ends
 *             (not the arrowhead, the arrow itself).
 * @param radius The radius of the arrowhead. This controls how "thick" the arrowhead looks.
 */
function drawArrowhead(context, from, to, radius) {
	var x_center = to.x;
	var y_center = to.y;

	var angle;
	var x;
	var y;

	context.beginPath();

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

	context.fill();
}

