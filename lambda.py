import json
import boto3


def detect_faces(photo, bucket):
    
    client=boto3.client('rekognition')
    
    # response = client.detect_faces(Image={'S3Object':{'Bucket':bucket,'Name':photo}},Attributes=['ALL'])
    
    response = client.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':photo}},
                                    MaxLabels=10)
        
                                    print('Detected labels for ' + photo)
                                    print()
                                    for label in response['Labels']:
                                        if label['Name'] == 'Person':
                                            print ("Label: " + label['Name'])
                                            print ("Confidence: " + str(label['Confidence']))
                                            return label['Confidence']
                                    
# print('Detected faces for ' + photo)
                                                return 0


def lambda_handler(event, context):
    # TODO implement
    dynamodb = boto3.client('dynamodb')
    
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        tmpkey = key.replace('/', '')
        print(tmpkey)
    
    face = detect_faces(tmpkey, bucket)
    tmpkey = tmpkey.split('.')[0]
    print(face)
    if face > 0:
        dynamodb.update_item(TableName='health_condition', Key={'email':{'S':tmpkey + "@gmail.com"}},
                             UpdateExpression = 'SET face = :f',
                             ExpressionAttributeValues = {':f':{"N":'1'}})
    else:
        dynamodb.update_item(TableName='health_condition', Key={'email':{'S':tmpkey + "@gmail.com"}},
                             UpdateExpression = 'SET face = :f',
                             ExpressionAttributeValues = {':f':{"N":'0'}})



return {
    'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
