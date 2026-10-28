import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { Zone, ZoneInput, ZoneStatus } from './src/types';
import {
  getZones,
  getZone,
  createZone,
  replaceZone,
  updateZone,
  deleteZone,
  isZone
} from './src/api';

type Screen = 'list' | 'detail' | 'new' | 'edit';

const STATUSES: ZoneStatus[] = ['OPEN', 'FULL', 'CLOSED'];

const emptyForm: ZoneInput = {
  name: '',
  capacity: 1000,
  status: 'OPEN'
};

function errorText(cause: unknown): string {
  return cause instanceof Error ? cause.message : 'Error de red';
}

export default function App() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selected, setSelected] = useState<Zone | null>(null);
  const [screen, setScreen] = useState<Screen>('list');
  const [form, setForm] = useState<ZoneInput>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function clearFeedback() {
    setError('');
    setMessage('');
  }

  // Si la API no devuelve cuerpo (p. ej. un DELETE) se muestra "null" en vez de "undefined"
  function showResult(method: string, result: unknown) {
    setMessage(
      'Petición ' + method + ' completada.\n' +
      JSON.stringify(result ?? null, null, 2)
    );
  }

  async function loadZones() {
    setLoading(true);
    setError('');

    try {
      setZones(await getZones());
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadZones();
  }, []);

  // DETALLE y EDITAR necesitan una zona elegida: si no la hay, se avisa y se vuelve al listado
  function needSelection() {
    setMessage('');
    setError('Selecciona primero una zona del listado.');
    setConfirmDelete(false);
    setScreen('list');
  }

  async function openDetail(id: string) {
    clearFeedback();
    setConfirmDelete(false);

    try {
      setSelected(await getZone(id));
      setScreen('detail');
    } catch (cause) {
      // Si la API no puede devolver la zona, se usa la copia del listado
      const local = zones.find(zone => zone.id === id);

      if (local) {
        setSelected(local);
        setScreen('detail');
        setError(
          'No se pudo consultar la zona en la API (' + errorText(cause) +
          '). Se muestra la copia del listado.'
        );
      } else {
        setError(errorText(cause));
      }
    }
  }

  function openDetailTab() {
    if (!selected) {
      needSelection();
      return;
    }

    setError('');
    setConfirmDelete(false);
    setScreen('detail');
  }

  function openNew() {
    setForm({ ...emptyForm });
    clearFeedback();
    setConfirmDelete(false);
    setScreen('new');
  }

  function openEdit() {
    if (!selected) {
      needSelection();
      return;
    }

    setForm({
      name: selected.name,
      capacity: selected.capacity,
      status: selected.status
    });
    clearFeedback();
    setConfirmDelete(false);
    setScreen('edit');
  }

  async function saveZone() {
    const name = form.name.trim();

    if (!name) {
      setError('Introduce el nombre de la zona.');
      return;
    }

    if (!Number.isInteger(Number(form.capacity)) ||
        Number(form.capacity) <= 0) {
      setError('La capacidad debe ser un entero positivo.');
      return;
    }

    const input: ZoneInput = {
      name,
      capacity: Number(form.capacity),
      status: form.status
    };

    setBusy(true);
    clearFeedback();

    try {
      if (screen === 'new') {
        const result = await createZone(input);
        showResult('POST', result);

        if (isZone(result)) {
          setZones(current => [...current, result]);
        } else {
          // Sin el id que asigna la API no se puede añadir en local: se recarga
          await loadZones();
        }

        setScreen('list');
      } else if (screen === 'edit' && selected) {
        const result = await replaceZone(selected.id, input);
        showResult('PUT', result);

        const updated: Zone = { ...selected, ...input };
        setSelected(updated);
        setZones(current =>
          current.map(zone => zone.id === updated.id ? updated : zone)
        );
        setScreen('detail');
      }
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(status: ZoneStatus) {
    if (!selected) return;

    setBusy(true);
    clearFeedback();

    try {
      const result = await updateZone(selected.id, { status });
      showResult('PATCH', result);

      const updated: Zone = { ...selected, status };
      setSelected(updated);
      setZones(current =>
        current.map(zone => zone.id === updated.id ? updated : zone)
      );
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setBusy(false);
    }
  }

  // Primera pulsación: pide confirmación. Segunda: elimina.
  async function removeZone() {
    if (!selected) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setBusy(true);
    clearFeedback();

    try {
      const result = await deleteZone(selected.id);
      showResult('DELETE', result);

      setZones(current => current.filter(zone => zone.id !== selected.id));
      setSelected(null);
      setConfirmDelete(false);
      setScreen('list');
    } catch (cause) {
      setError(errorText(cause));
    } finally {
      setBusy(false);
    }
  }

  function updateForm<K extends keyof ZoneInput>(
    key: K,
    value: ZoneInput[K]
  ) {
    setForm(current => ({ ...current, [key]: value }));
  }

  const title =
    screen === 'list' ? 'Espacios del recinto' :
    screen === 'detail' ? 'Detalle del espacio' :
    screen === 'new' ? 'Nueva zona' : 'Editar zona';

  return (
    <View style={styles.page}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>VENUE CONTROL</Text>
        <View style={styles.header}>
          <View style={styles.liveDot} />
          <Text style={styles.live}>GESTIÓN OPERATIVA</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Control de espacios, capacidades y estados del recinto.
        </Text>

        <View style={styles.navigation}>
          <Pressable
            style={[styles.navButton, screen === 'list' && styles.navActive]}
            onPress={() => {
              setConfirmDelete(false);
              setScreen('list');
            }}>
            <Text style={styles.navText}>LISTADO</Text>
          </Pressable>

          <Pressable
            style={[styles.navButton, screen === 'detail' && styles.navActive]}
            onPress={openDetailTab}>
            <Text style={styles.navText}>DETALLE</Text>
          </Pressable>

          <Pressable
            style={[styles.navButton, screen === 'new' && styles.navActive]}
            onPress={openNew}>
            <Text style={styles.navText}>NUEVO</Text>
          </Pressable>

          <Pressable
            style={[styles.navButton, screen === 'edit' && styles.navActive]}
            onPress={openEdit}>
            <Text style={styles.navText}>EDITAR</Text>
          </Pressable>
        </View>

        {/* Avisos justo debajo del menú para que siempre se vean */}
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
        ) : null}

        {message ? (
          <View style={styles.responseBox}>
            <Text style={styles.responseTitle}>RESPUESTA DE LA API</Text>
            <Text selectable style={styles.responseText}>{message}</Text>
          </View>
        ) : null}

        {loading && <Text style={styles.subtitle}>Cargando zonas…</Text>}

        {screen === 'list' && (
          <>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Zonas registradas</Text>
              <Text style={styles.counter}>{zones.length} ZONAS</Text>
            </View>

            {!loading && zones.length === 0 && (
              <Text style={styles.subtitle}>
                No hay zonas que mostrar. Crea una o recarga el listado.
              </Text>
            )}

            {zones.map(zone => (
              <Pressable
                key={zone.id}
                style={styles.card}
                onPress={() => void openDetail(zone.id)}>
                <View style={styles.cardTop}>
                  <Text style={styles.tag}>{zone.id}</Text>
                  <Text style={[
                    styles.status,
                    zone.status === 'OPEN' ? styles.open :
                    zone.status === 'FULL' ? styles.full : styles.closed
                  ]}>
                    {zone.status}
                  </Text>
                </View>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.cardInfo}>
                  CAPACIDAD · {zone.capacity.toLocaleString('es-ES')} PERSONAS
                </Text>
                <Text style={styles.linkText}>VER DETALLE →</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.primaryButton}
              onPress={openNew}>
              <Text style={styles.primaryButtonText}>+ CREAR ZONA</Text>
            </Pressable>

            <Pressable
              style={[
                styles.secondaryButton,
                (loading || busy) && styles.disabled
              ]}
              disabled={loading || busy}
              onPress={() => void loadZones()}>
              <Text style={styles.secondaryButtonText}>RECARGAR LISTADO · GET</Text>
            </Pressable>
          </>
        )}

        {screen === 'detail' && selected && (
          <View style={styles.card}>
            <Text style={styles.tag}>{selected.id}</Text>
            <Text style={styles.zoneName}>{selected.name}</Text>
            <Text style={styles.cardInfo}>
              CAPACIDAD · {selected.capacity.toLocaleString('es-ES')} PERSONAS
            </Text>
            <Text style={styles.cardInfo}>ESTADO ACTUAL</Text>
            <Text style={styles.detailStatus}>{selected.status}</Text>

            <Text style={styles.label}>CAMBIAR ESTADO · PATCH</Text>
            <View style={styles.statusChoices}>
              {STATUSES.map(status => (
                <Pressable
                  key={status}
                  disabled={busy}
                  style={[
                    styles.statusButton,
                    selected.status === status && styles.statusSelected,
                    busy && styles.disabled
                  ]}
                  onPress={() => void changeStatus(status)}>
                  <Text style={styles.statusButtonText}>{status}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.primaryButton} onPress={openEdit}>
              <Text style={styles.primaryButtonText}>EDITAR ZONA · PUT</Text>
            </Pressable>

            {confirmDelete && (
              <Text style={styles.confirmText}>
                Esta acción elimina la zona. Pulsa de nuevo para confirmar.
              </Text>
            )}

            <Pressable
              style={[styles.dangerButton, busy && styles.disabled]}
              disabled={busy}
              onPress={() => void removeZone()}>
              <Text style={styles.primaryButtonText}>
                {busy ? 'ENVIANDO…' :
                  confirmDelete ? 'CONFIRMAR ELIMINACIÓN · DELETE' : 'ELIMINAR ZONA · DELETE'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                setConfirmDelete(false);
                setScreen('list');
              }}>
              <Text style={styles.secondaryButtonText}>← VOLVER AL LISTADO</Text>
            </Pressable>
          </View>
        )}

        {(screen === 'new' || screen === 'edit') && (
          <View style={styles.card}>
            {screen === 'edit' && selected && (
              <Text style={styles.tag}>CÓDIGO · {selected.id}</Text>
            )}

            <Text style={styles.label}>NOMBRE</Text>
            <TextInput
              value={form.name}
              onChangeText={value => updateForm('name', value)}
              placeholder="Nombre de la zona"
              placeholderTextColor="#77798b"
              style={styles.input}
            />

            <Text style={styles.label}>CAPACIDAD</Text>
            {/* Solo dígitos: una coma o un punto daban "NaN", y el campo se puede dejar vacío */}
            <TextInput
              value={form.capacity > 0 ? String(form.capacity) : ''}
              onChangeText={value => updateForm(
                'capacity',
                Number(value.replace(/\D/g, ''))
              )}
              keyboardType="number-pad"
              placeholder="Número de personas"
              placeholderTextColor="#77798b"
              style={styles.input}
            />

            <Text style={styles.label}>ESTADO</Text>
            <View style={styles.statusChoices}>
              {STATUSES.map(status => (
                <Pressable
                  key={status}
                  style={[
                    styles.statusButton,
                    form.status === status && styles.statusSelected
                  ]}
                  onPress={() => updateForm('status', status)}>
                  <Text style={styles.statusButtonText}>{status}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.primaryButton, busy && styles.disabled]}
              disabled={busy}
              onPress={() => void saveZone()}>
              <Text style={styles.primaryButtonText}>
                {busy ? 'ENVIANDO…' :
                  screen === 'new' ? 'CREAR ZONA · POST' : 'GUARDAR CAMBIOS · PUT'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => setScreen(screen === 'edit' && selected ? 'detail' : 'list')}>
              <Text style={styles.secondaryButtonText}>CANCELAR</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.footer}>
          VENUE CONTROL / API HTTP / ESCRITURAS SIMULADAS
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#090B10'
  },
  content: {
    padding: 24,
    paddingTop: 48,
    gap: 16,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center'
  },
  eyebrow: {
    color: '#C5A4FF',
    fontWeight: '800',
    letterSpacing: 3,
    fontSize: 13
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6BE0B1'
  },
  live: {
    color: '#6BE0B1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800'
  },
  subtitle: {
    color: '#A8ACBC',
    fontSize: 15,
    lineHeight: 23
  },
  navigation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8
  },
  navButton: {
    flexGrow: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#303442',
    alignItems: 'center',
    backgroundColor: '#12151E'
  },
  navActive: {
    borderColor: '#C5A4FF',
    backgroundColor: '#282039'
  },
  navText: {
    color: '#E6E0F4',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700'
  },
  counter: {
    color: '#C5A4FF',
    fontSize: 11,
    fontWeight: '800'
  },
  card: {
    padding: 20,
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#303442',
    backgroundColor: '#131620'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  tag: {
    color: '#C5A4FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1
  },
  status: {
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
    overflow: 'hidden'
  },
  open: {
    color: '#6BE0B1',
    backgroundColor: '#17352F'
  },
  full: {
    color: '#FFC978',
    backgroundColor: '#392B1A'
  },
  closed: {
    color: '#FF8F9B',
    backgroundColor: '#3A2029'
  },
  zoneName: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800'
  },
  cardInfo: {
    color: '#A8ACBC',
    fontSize: 12,
    letterSpacing: 1,
    lineHeight: 20
  },
  linkText: {
    color: '#C5A4FF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4
  },
  primaryButton: {
    padding: 15,
    backgroundColor: '#8060C7',
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 4
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1
  },
  secondaryButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#45495B',
    borderRadius: 9,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#D2D5E2',
    fontSize: 12,
    fontWeight: '700'
  },
  dangerButton: {
    padding: 14,
    backgroundColor: '#742D3B',
    borderRadius: 9,
    alignItems: 'center'
  },
  confirmText: {
    color: '#FF9CA8',
    fontSize: 13,
    lineHeight: 20
  },
  disabled: {
    opacity: 0.4
  },
  label: {
    color: '#BFC3D4',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4
  },
  input: {
    color: '#FFFFFF',
    backgroundColor: '#0B0D13',
    borderWidth: 1,
    borderColor: '#373B4A',
    borderRadius: 8,
    padding: 13,
    fontSize: 16
  },
  statusChoices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  statusButton: {
    flexGrow: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#373B4A',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#0D1017'
  },
  statusSelected: {
    borderColor: '#C5A4FF',
    backgroundColor: '#282039'
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  detailStatus: {
    color: '#C5A4FF',
    fontSize: 20,
    fontWeight: '800'
  },
  error: {
    color: '#FF9CA8',
    fontSize: 14,
    lineHeight: 22,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5A2A33',
    backgroundColor: '#2A151B'
  },
  responseBox: {
    padding: 16,
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#354B45',
    backgroundColor: '#111C1A'
  },
  responseTitle: {
    color: '#6BE0B1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1
  },
  responseText: {
    color: '#D7E8E1',
    fontSize: 12,
    lineHeight: 19,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' })
  },
  footer: {
    color: '#676D80',
    fontSize: 10,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24
  }
});