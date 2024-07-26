let Question = require("../models/questions");
let Tag = require("../models/tags");
const { get_answer } = require("./home");

function processSearchInput(input) {
  let taglist = [];
  let textlist = [];
  let processedInput = [taglist, textlist];
  let termsArray = input.split(" "); //split on space
  for (let i = 0; i < termsArray.length; i++) {
    let term = termsArray[i];
    term = term.toLowerCase();
    if (term.indexOf("[") >= 0 || term.indexOf("]") >= 0) {
      taglist.push(term.slice(1, term.length - 1));
    } else {
      textlist.push(term);
    }
  }

  // console.log(processedInput);
  return processedInput;
}

async function titleSearch(searchList, questions) {
  for (let i = 0; i < searchList.length; i++) {
    let term = searchList[i];
    term = term.toLowerCase(); // Just in case

    let qs = await Question.find({ title: { $regex: term, $options: "i" } });
    for (let j = 0; j < qs.length; j++) {
      let isFound = -1;
      for (let k = 0; k < questions.length; k++) {
        if (questions[k].id === qs[j].id) {
          isFound = 1;
          break;
        }
      }

      if (isFound !== 1) {
        questions.push(qs[j]);
      }
    }
  }
}

async function textSearch(searchList, questions) {
  for (let i = 0; i < searchList.length; i++) {
    let term = searchList[i];
    term = term.toLowerCase(); // Just in case

    let qs = await Question.find({ text: { $regex: term, $options: "i" } });
    for (let j = 0; j < qs.length; j++) {
      let isFound = -1;
      for (let k = 0; k < questions.length; k++) {
        if (questions[k].id === qs[j].id) {
          isFound = 1;
          break;
        }
      }

      if (isFound !== 1) {
        questions.push(qs[j]);
      }
    }
  }
}

let getTags = async (arrayTags) => {
  let arr = [];
  for (let i = 0; i < arrayTags.length; i++) {
    let tag = await Tag.find({ name: arrayTags[i] });
    arr.push(tag[0]);
  }

  // console.log(arr);
  return arr;
};

async function tagSearch(searchList, questions) {
  let tags = await getTags(searchList); //this gets the tag ids given the tags

  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i];
    // let tagObj = new mongoose.Types.ObjectId(tag._id);
    // console.log(tag._id.toString());
    // let tagId = tag._id.toString();
    // console.log(tagId);
    let qs = await Question.find({ tags: tag._id });
    // console.log(qs);
    for (let j = 0; j < qs.length; j++) {
      let isFound = -1;
      for (let k = 0; k < questions.length; k++) {
        if (questions[k].id === qs[j].id) {
          isFound = 1;
          break;
        }
      }

      if (isFound !== 1) {
        questions.push(qs[j]);
      }
    }
  }
}

let search = async (input, res, sorting) => {
  let processedInput = processSearchInput(input);
  let tagsList = processedInput[0];
  let textuals = processedInput[1];
  let qs = [];
  await titleSearch(textuals, qs);
  await textSearch(textuals, qs);
  await tagSearch(tagsList, qs);
  let counter = 0;
  let questions = qs.map(function (question) {
    // console.log(question.tags);
    return {
      qid: "q" + counter++,
      id: question._id,
      title: question.title,
      text: question.text,
      tagIds: question.tags,
      askedBy: question.asked_by,
      askDate: question.ask_date_time,
      ansIds: question.answers,
      views: question.views,
      votes: question.votes
    };
  });

  for (let i = 0; i < questions.length; i++) {
    let tagIds = questions[i].tagIds;
    let names = [];
    for (let j = 0; j < tagIds.length; j++) {
      let id = tagIds[j];
      let tag = await Tag.find({ _id: id });
      names.push(tag[0].name);
    }

    questions[i].names = names;
  }

  if(sorting === 0) questions = await newest_questions(questions);
  else if(sorting === 1) questions = await active_questions(questions);
  else if(sorting === 2) questions = await unanswered_questions(questions);
  res.send(questions);
};

let newest_questions = async function (qs) {
  // let questions = await get_questions();
  let questions = qs;

  let updatedQuestions = [];
  for (let i = questions.length - 1; i >= 0; i--) {
    updatedQuestions.push(questions[i]);
  }

  // res.send(updatedQuestions);
  return updatedQuestions;
};

let active_questions = async function (qs) {
  // let questions = await get_questions();
  let questions = qs;
  let activeQs = [];
  let unansQs = [];

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].ansIds.length === 0) {
      unansQs.push(questions[i]);
    } else {
      activeQs.push(questions[i]);
    }
  }

  //get most recent answer of each question
  let answers = [];
  for (let i = 0; i < activeQs.length; i++) {
    let ans = await get_answer(
      activeQs[i].ansIds[activeQs[i].ansIds.length - 1]
    );
    answers.push(ans[0]);
  }

  //sort as most recent answers first
  answers.sort((a1, a2) => {
    let a1Date = a1.ansDate;
    let a2Date = a2.ansDate;
    return a2Date - a1Date;
  });

  //now, sort questions based on their answers' index where all answers are sorted
  let updatedQuestions = []; //unique answer/question mapping so this is possible
  for (let i = 0; i < answers.length; i++) {
    for (let j = 0; j < questions.length; j++) {
      let aid = answers[i].aid;
      let qaid = questions[j].ansIds[questions[j].ansIds.length - 1];
      // console.log("Aid: " + aid + ",\nQaid: " + qaid);
      if (aid == qaid) {
        updatedQuestions.push(questions[j]);
        break;
      }
    }
  }

  //sort to be most recent questions first
  unansQs.sort((q1, q2) => {
    return q2.qid.slice(1) - q1.qid.slice(1);
  });

  for (let i = 0; i < unansQs.length; i++) {
    updatedQuestions.push(unansQs[i]);
  }

  // res.send(updatedQuestions);
  return updatedQuestions;
};

let unanswered_questions = async function (qs) {
  // let questions = await get_questions();
  let questions = qs;
  let updatedQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].ansIds.length === 0) {
      updatedQuestions.push(questions[i]);
    }
  }

  if (updatedQuestions.length > 0) {
    updatedQuestions.sort((q1, q2) => {
      return q2.qid.slice(1) - q1.qid.slice(1);
    });
  }

  // res.send(updatedQuestions);
  return updatedQuestions;
};


module.exports = search;
