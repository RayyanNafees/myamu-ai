import { AwsClient } from "aws4fetch";

export const presignURL = async (fileName: string) => {
	const {
		R2_ACCESS_KEY_ID,
		R2_SECRET_ACCESS_KEY,
		R2_ACCOUNT_ID,
        R2_BUCKET
	} = process.env;

    console.log({
        R2_ACCESS_KEY_ID,
		R2_SECRET_ACCESS_KEY,
		R2_ACCOUNT_ID,
	})

	const r2 = new AwsClient({
		accessKeyId: R2_ACCESS_KEY_ID as string,
		secretAccessKey: R2_SECRET_ACCESS_KEY as string,
	});

	const url = new URL(
		`https://${R2_BUCKET}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`,
	);

	const signed = await r2.sign(
		new Request(url, {
			method: "PUT",
		}),
		{
			aws: { signQuery: true, allHeaders: true, region: "auto" },
		},
	);

	return signed;
};
