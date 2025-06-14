import type { QueryClient } from '@tanstack/react-query';
import { useNavigation } from 'react-router';
import { useActionData } from 'react-router';
// import { redirect } from 'react-router';
import { Form, type ActionFunctionArgs } from 'react-router';

export function action(queryClient: QueryClient) {
  return async ({ request, params }: ActionFunctionArgs) => {
    await new Promise((resolve) => setTimeout(() => resolve(1), 5000));
    const formData = await request.formData();
    console.log('form data', formData);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // to invalidateQueries
    queryClient.invalidateQueries({ queryKey: ['query-key'] });

    console.log({ data, params });
    // to redirect to home
    // return redirect('/');

    //NOTE: can be accessed using useActionData
    return data;
  };
}

export function Login() {
  const data = useActionData() as Awaited<ReturnType<ReturnType<typeof action>>>;
  //NOTE: to check form submit status
  const navigation = useNavigation();
  return (
    <div>
      {/* NOTE: action refers to the route whose action (defined in route object) is to be used. Here uses the action defined in route object with path login */}
      {/* NOTE: action vanda tw tanstack query ko mutation use garda ja thik hola😮‍💨 */}
      <Form method='post' action='/login'>
        <input placeholder='email' name='email' />
        <input placeholder='password' name='password' />
        <button type='submit'>{navigation.state === 'submitting' ? 'submitting' : 'submit'}</button>
      </Form>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
