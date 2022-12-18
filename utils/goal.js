var exports = module.exports = {};

exports.getGoalTitle = (goalTitle, scoreType, score) => {
  if (scoreType === 'NUMBER') {
    return `${goalTitle} 시험 ${score}점 이상 받는다!`
  }
  if (scoreType === 'LETTER') {
    return `${goalTitle} 시험 ${score} 이상 받는다!`
  }
  if (scoreType === 'PERCENTAGE') {
    return `${goalTitle} 시험 ${score}% 이상 받는다!`
  }
}

exports.getGoalTitleSidebar = (goalTitle, scoreType, score) => {
  if (scoreType === 'NUMBER') {
    return `${goalTitle} 시험 ${score}점 이상`
  }
  if (scoreType === 'LETTER') {
    return `${goalTitle} 시험 ${score} 이상`
  }
  if (scoreType === 'PERCENTAGE') {
    return `${goalTitle} 시험 ${score}% 이상`
  }
}