import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { SESClient } from '@aws-sdk/client-ses';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// AWS設定
const awsConfig = {
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
};

// Cognito Identity Provider Client
export const cognitoClient = new CognitoIdentityProviderClient(awsConfig);

// DynamoDB Client
export const dynamoClient = new DynamoDBClient(awsConfig);

// DynamoDB Document Client
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 Client
export const s3Client = new S3Client(awsConfig);

// SES Client
export const sesClient = new SESClient(awsConfig);
