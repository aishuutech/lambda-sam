let response;
const dynamodb = require('aws-sdk/clients/dynamodb')
const docClient = new dynamodb.DocumentClient()
exports.getAll = async (event, context) => {
    const data = await docClient.scan({
        TableName : 'User'
    }).promise()
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                users : data.Items,
            })
        }
    return response
};

exports.create = async (event, context) => {
    const {userName,email,password,dob} = JSON.parse(event.body)
    console.log(userName,email,password,dob)
    const data = await docClient.put({
        TableName : 'User',
        Item : {
            id : uuid(),
            userName,
            email,
            password,
            dob
        }
    }).promise()
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                user : data.Items,
                message : "User created successfully"
            })
        }
    return response
};

exports.delete = async (event, context) => {
    const data = await docClient.delete({
        TableName : 'User',
        Key : {
            id : event.pathParameters.id
        }
    }).promise()
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                user : event.pathParameters.id,
                message : "User deleted successfully"
            })
        }
    return response
};

exports.update = async (event, context) => {
    const Item = JSON.parse(event.body)
    const data = await docClient.update({
        TableName : 'User',
        Key : {
            id : event.pathParameters.id
        },
        UpdateExpression : 'set userName= :u, email= :e, password= :p, dob= :d',
        ExpressionAttributeValues : {
            ':u' : Item.userName,
            ':e' : Item.email,
            ':p' : Item.password,
            ':d' : Item.dob
        } ,
        ReturnValues : "UPDATED_NEW"
    }).promise()
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                user : data.Item,
                message : "User updated successfully"
            })
        }
    return response
};