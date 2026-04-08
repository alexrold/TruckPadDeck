import {ThemedText, ThemedView} from '@/components/themed';
import {Link, Stack} from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{title: 'Oops!'}} />
      <ThemedView className="flex-1 items-center justify-center p-5">
        <ThemedText type="title" className="mb-4">
          Pantalla no encontrada
        </ThemedText>

        <Link href="/" className="mt-4 py-4">
          <ThemedText
            type="link"
            className="text-light-primary dark:text-dark-primary font-sans"
          >
            Volver al inicio
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
