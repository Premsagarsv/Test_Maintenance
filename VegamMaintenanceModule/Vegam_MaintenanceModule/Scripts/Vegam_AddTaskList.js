var taskListInfoModel =
    {
        txtTaskListName: ko.observable(''),
        txtDescription: ko.observable(''),
        addTaskListErrorMessage: ko.observable(''),
        taskListInfoArray: ko.observableArray([])        
    }

//var operationInfoModel =
//    {
//        txtOperationName: ko.observable(''),
//        txtMaintainenceStrategy: ko.observable(''),
//        taskListOptions: ko.observableArray(['General', 'Equipment', 'Functional Loc'])
//    }

function LoadAddTaskListInformation(pagerData)
{
    ko.applyBindings(taskListInfoModel, document.getElementById("divTaskListInfo"));
    taskListInfoModel.taskListInfoArray.push(GetOpertaionViewModel(undefined));
}

function SaveTaskList()
{
    if (taskListInfoModel.txtTaskListName() == '')
    {
        taskListInfoModel.addTaskListErrorMessage('Please enter taskList name');
    }
    else
    {
        taskListInfoModel.addTaskListErrorMessage('');
    }

}
function GetOpertaionViewModel(opeartionList)
{
    var operationInfoModel = {}
    if (opeartionList == undefined)
    {
        operationInfoModel.txtOperationName = ko.observable('');
        operationInfoModel.txtMaintainenceStrategy = ko.observable('');
        operationInfoModel.taskListOptions = ko.observableArray(['General', 'Equipment', 'Functional Loc']);
        operationInfoModel.taskId = ko.observable('1');
    }
    return operationInfoModel;
}

function AddNewTaskList()
{
    taskListInfoModel.taskListInfoArray.push(GetOpertaionViewModel(undefined));
}