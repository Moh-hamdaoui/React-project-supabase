import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '../../services/supabase/supabaseClient';

const AuthComponent = () => {
  return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
};

export default AuthComponent;
